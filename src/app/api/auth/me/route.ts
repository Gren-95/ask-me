import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getUserById } from "@/lib/auth";
import { authOptions } from "../options";

export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the user
    const user = await getUserById(parseInt(session.user.id));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
