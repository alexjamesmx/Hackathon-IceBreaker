// Import necessary modules
import Match from "@lib/models/match";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Handle GET request for fetching a specific match
export async function GET(req) {
  try {
    // Extract the match ID from the request URL
    const { pathname } = req.nextUrl;
    const matchId = pathname.split("/").pop(); // Extract the ID from the URL

    // Validate the match ID
    if (!matchId) {
      return NextResponse.json(
        { message: "Match ID is required" },
        { status: 400 }
      );
    }

    // Verify the user's JWT token to get the user ID (optional, based on your needs)
    const authorizationHeader = req.headers.get("authorization");
    const token = authorizationHeader
      ? authorizationHeader.replace("Bearer ", "")
      : null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.userId;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch the match details from the database
    const match = await Match.findById(matchId);

    if (!match) {
      return NextResponse.json({ message: "Match not found" }, { status: 404 });
    }

    // Return the match details

    // Get the players
    const players = await Match.getPlayers(matchId);
    match.players = players;

    return NextResponse.json({ match });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching match: " + error.message },
      { status: 500 }
    );
  }
}
