import type { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "@/app/lib/dbClient";
import * as sql from "mssql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const users = await executeQuery("SELECT * FROM Users");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Missing name or email" });
      }

      await executeQuery(
        "INSERT INTO Users (name, email) VALUES (@name, @email)",
        [
          { name: "name", type: sql.VarChar(255), value: name },
          { name: "email", type: sql.VarChar(255), value: email },
        ]
      );

      res.status(201).json({ message: "User added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}