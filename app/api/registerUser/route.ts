import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
    
        if (!name || !email || !password) {
          return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
    
        // Check if the user already exists
        const client = await pool.connect();
        const existingUser = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (existingUser.rows.length > 0) {
          client.release();
          return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Insert new user into the database
        await client.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
          [name, email, hashedPassword]
        );
    
        client.release();
        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
      } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
}