import { hash } from "bcryptjs";
import { executeQuery } from "@/app/lib/db";

export const runtime = "nodejs"; // Add this line for compatibility

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    // Check if user already exists
    const existingUser = await executeQuery(
      "SELECT * FROM Users WHERE email = @param0",
      [email]
    );

    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: "Email already in use" }), { status: 409 });
    }

    // Hash password before storing in database
    const hashedPassword = await hash(password, 10);

    // Insert new user
    await executeQuery(
      "INSERT INTO Users (username, email, password) VALUES (@param0, @param1, @param2)",
      [name, email, hashedPassword]
    );

    return new Response(JSON.stringify({ message: "User created" }), { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}