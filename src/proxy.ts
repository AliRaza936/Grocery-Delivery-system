import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from "next/server";
import { URL } from "url";
import { auth } from "./auth";

export async function proxy(req:NextRequest){
  const {pathname} = req.nextUrl
 
  if (
  pathname === "/" ||
  pathname.startsWith("/login") ||
  pathname.startsWith("/register") ||
  pathname.startsWith("/user/cart") ||
  pathname.startsWith("/user/checkout") ||
  pathname.startsWith("/api/auth") ||
  pathname.startsWith("/api/socket")
) {
  return NextResponse.next()
}
 const session = await auth()

  if(!session){
    const loginUrl = new URL('/login',req.url)
    loginUrl.searchParams.set('callbackUrl',req.url)
   return NextResponse.redirect(loginUrl)
  }

  
  let role = session.user?.role;


  if(pathname.startsWith("/user") && role !== "user"){
    return NextResponse.redirect(new URL('/unauthorized',req.url))
  }
  if(pathname.startsWith("/delivery") && role !== "deliveryBoy"){
    return NextResponse.redirect(new URL('/unauthorized',req.url))
  }
  if (
  pathname.startsWith("/admin") &&
  (!role || !["admin", "dummy_admin"].includes(role))
) {
  return NextResponse.redirect(new URL("/unauthorized", req.url))
}

 return NextResponse.next()
}


  export const config = {
      matcher:'/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    };