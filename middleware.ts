import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/services",
  "/contact",
  "/staff",
  "/donate",
  "/health-assessment",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/chat(.*)",
  "/api/send-email(.*)",
]);

// Define protected dashboard routes
const isDashboardRoute = createRouteMatcher([
  "/admin(.*)",
  "/staff-portal(.*)",
  "/patient(.*)",
]);

// Define routes that require authentication but aren't dashboards
const isAuthRequiredRoute = createRouteMatcher([
  "/appointments(.*)",
  "/chat(.*)",
  "/register-patient(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (isDashboardRoute(request)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect auth-required routes (appointments, chat)
  if (isAuthRequiredRoute(request)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
