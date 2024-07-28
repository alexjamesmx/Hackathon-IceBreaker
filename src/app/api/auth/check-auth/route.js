import User from "@lib/models/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Handler for GET request
export async function GET(req) {
  try {
    // Get the token from the request headers
    const authorizationHeader = req.headers.get("authorization");
    const token = authorizationHeader
      ? authorizationHeader.replace("Bearer ", "")
      : null;

    if (!token) {
      console.log("Token not found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve user data from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Authenticated", user },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
