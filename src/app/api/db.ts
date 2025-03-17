import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/dbClient';
import * as sql from 'mssql';

export async function GET(request: NextRequest) {
  try {
    const users = await executeQuery("SELECT * FROM Users");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    await executeQuery(
      "INSERT INTO Users (name, email) VALUES (@name, @email)",
      [
        { name: "name", type: sql.VarChar(255), value: name },
        { name: "email", type: sql.VarChar(255), value: email },
      ]
    );

    return NextResponse.json({ message: "User added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}