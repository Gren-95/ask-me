import { NextResponse } from "next/server";
import { registerUser, RegistrationData } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body as RegistrationData;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Register the user
    const user = await registerUser({ email, password, name });

    // Return the user (without password)
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error registering user:", error);
    const errorMessage = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
