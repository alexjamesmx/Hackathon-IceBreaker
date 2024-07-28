import { compare } from "bcrypt";
import User from "@lib/models/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Handle POST request for user login
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validate email and password
    if (!email || !password) {
      return NextResponse.json(
        { message: "Please provide an email and password" },
        { status: 400 }
      );
    }

    // Retrieve user from the database
    const user = await User.findByEmail(email);

    // Check if user exists and password is correct
    if (!user || !(await compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create a JWT token for the user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const response = NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
    response.headers.set("Authorization", `Bearer ${token}`);
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error in Login" }, { status: 500 });
  }
}
