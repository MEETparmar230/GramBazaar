import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized",user:null }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)  as jwt.JwtPayload;

     if (!decoded || !decoded.role) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
    
    return NextResponse.json({ message: "Token valid", user: decoded }, { status: 200 });
  } catch (err) {
    console.log("Error:",err)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
