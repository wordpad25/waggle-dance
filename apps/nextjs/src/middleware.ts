// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { newDraftGoalRoute } from "./stores/goalStore";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname === "/" || url.pathname === "") {
    url.pathname = newDraftGoalRoute();
    return NextResponse.rewrite(url);
  }
}
