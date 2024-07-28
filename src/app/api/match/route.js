// Import necessary modules
import { v4 as uuidv4 } from "uuid"; // Use a UUID library or any other method to generate unique strings
import Match from "@lib/models/match";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { BASE_URL } from "@lib/api_consts";

// Handle POST request for creating a new match
export async function POST(req) {
  try {
    const { match_name, secretKey, description, id_game } = await req.json();

    // Validate name, secretKey, and description
    if (!match_name || !secretKey || !description || !id_game) {
      return NextResponse.json(
        {
          message: "Please fill in all fields",
        },
        { status: 400 }
      );
    }

    // Generate a unique match URL
    let match_url;
    let isUnique = false;

    //get user id from the tjw token bearer
    const authorizationHeader = req.headers.get("authorization");

    const token = authorizationHeader
      ? authorizationHeader.replace("Bearer ", "")
      : null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_user = decoded.userId;

    if (!id_user) {
      return NextResponse.json(
        { message: "Please provide a valid user id" },
        { status: 400 }
      );
    }

    while (!isUnique) {
      match_url = `${BASE_URL}/public/link/${uuidv4()}`;
      const existingMatch = await Match.findByUrl(match_url);
      if (!existingMatch) {
        isUnique = true;
      }
    }

    // Create the match in the database
    const matchId = await Match.createMatch(
      match_name,
      secretKey,
      description,
      match_url,
      id_user,
      id_game
    );
    //
    return NextResponse.json(
      { message: "Match created successfully", matchId, match_url },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in creating match: " + error.message },
      { status: 500 }
    );
  }
}

// Handle GET request for fetching all matches
export async function GET(req) {
  try {
    //get user id from the tjw token bearer
    const authorizationHeader = req.headers.get("authorization");

    const token = authorizationHeader
      ? authorizationHeader.replace("Bearer ", "")
      : null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_user = decoded.userId;

    if (!id_user) {
      return NextResponse.json(
        { message: "Please provide a valid user id" },
        { status: 400 }
      );
    }

    const matches = await Match.findAllMyMatches(id_user);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error in fetching matches: " + error.message },
      { status: 500 }
    );
  }
}
