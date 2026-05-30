import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/** ScoutFight is free — no route requires login */
const middleware = clerkMiddleware(async () => {
  return NextResponse.next();
});

export default process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ? middleware
  : function fallbackMiddleware() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
