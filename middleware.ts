import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = [
  "/dashboard", 
  "/location",
  "/users",
  "/items"
];
const apiRoutes = [
  "/api/category",
  "/api/dashboard",
  "/api/item",
  "/api/location",
  "/api/otp",
  "/api/profile",
  "/api/user",
];
const publicRoutes = ["/"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const allProtectedRoutes = [...protectedRoutes, ...apiRoutes];
  const isProtectedRoute = allProtectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);
  const isApiRoute = apiRoutes.some((route) => path.startsWith(route));

  const token = req.cookies.get("jwt")?.value || null;
  let session = null;
  try {
    session = token ? await decrypt(token) : null;
  } catch (error) {
    console.error("Session decryption failed", error);
  }

  if (isProtectedRoute && !session?.userID) {
    if (isApiRoute) {
      return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (isPublicRoute && session?.userID) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}
