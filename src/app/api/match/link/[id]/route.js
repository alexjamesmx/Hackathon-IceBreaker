// Import necessary modules
import Match from "@lib/models/match";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { BASE_URL } from "@lib/api_consts";
// Handle GET request for fetching a specific match
export async function GET(req) {
  try {
    // Extract the match ID from the request URL
    const { pathname } = req.nextUrl;
    let matchLink = pathname.split("/").pop(); // Extract the ID from the URL

    // Validate the match Link
    if (!matchLink) {
      return NextResponse.json(
        { message: "Match Link is required" },
        { status: 400 }
      );
    }

    const baseUrl = BASE_URL;
    let url = baseUrl + "/public/link/" + matchLink;

    // Fetch the match details from the database
    const match = await Match.findByUrl(url);
    if (!match) {
      return NextResponse.json({ message: "Match not found" }, { status: 404 });
    }

    const { id, secret_key, id_game } = match;
    const game = await Match.getGame(id_game);

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({
      match: {
        id,
        match_url: url,
        secret_key,
        id_game,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching match: " + error.message },
      { status: 500 }
    );
  }
}
