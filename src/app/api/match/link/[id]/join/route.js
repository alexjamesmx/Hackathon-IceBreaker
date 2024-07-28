import { NextResponse } from "next/server";
import Match from "@lib/models/match";
// Handle POST
export async function POST(req) {
  try {
    const { match_id, nickname } = await req.json();
    if (!match_id || !nickname) {
      return NextResponse.json(
        { message: "Please fill in all fields" },
        { status: 400 }
      );
    }

    await Match.submitNickname(match_id, nickname);

    return NextResponse.json(
      { message: "Nickname submitted successfully" },
      { status: 200 }
    );

    //submit nickname to the server
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error submittin nickname: " + error.message },
      { status: 500 }
    );
  }
}
