import User from "@lib/models/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Handle POST request for user signup
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validate name, email, and password
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please provide a name, email, and password" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Email ID Already Exists" },
        { status: 400 }
      );
    }

    // Create the user in the database
    const user = await User.createUser(name, email, password);

    // Create a JWT token for the user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const response = NextResponse.json(
      { message: "Registration successful", token },
      { status: 201 }
    );
    response.headers.set("Authorization", `Bearer ${token}`);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in Registration" },
      { status: 500 }
    );
  }
}
