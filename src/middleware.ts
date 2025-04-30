import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

// Paths that require authentication
const protectedPaths = ["/forms/new"];

// Paths that are only accessible to non-authenticated users
const authPaths = ["/login", "/register"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is for authentication
  const isAuthPath = authPaths.some((authPath) => path === authPath);

  // If the path is for authentication and the user is already authenticated, redirect to forms
  if (isAuthPath && request.cookies.has("next-auth.session-token")) {
    return NextResponse.redirect(new URL("/forms", request.url));
  }

  return NextResponse.next();
}

// Add protected routes to the matcher
export const config = {
  matcher: [
    "/login",
    "/register",
    "/forms/new",
  ],
};
