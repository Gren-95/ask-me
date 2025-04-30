import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the auth token cookie
  cookies().set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
  });

  return NextResponse.json({ success: true });
}
