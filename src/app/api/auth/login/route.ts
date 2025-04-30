import { NextResponse } from "next/server";
import { loginUser, LoginData } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as LoginData;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Login the user
    const { user, token } = await loginUser({ email, password });

    // Set the token as an HTTP-only cookie
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Return the user (without password)
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error logging in:", error);
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
