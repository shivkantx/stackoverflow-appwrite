import { NextResponse, NextRequest } from "next/server";

import getOrCreateDB from "./models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // ⚠️ Only do this if your DB/storage initialization is very fast
  // Initialize database and storage (run once ideally, not on every request)
  await Promise.all([getOrCreateDB(), getOrCreateStorage()]);

  return NextResponse.next();
}

export const config = {
  /* match all request paths except for the ones that start with:

    - api
    - _next/static
    - _next/image
    - favicon.ico

  */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
