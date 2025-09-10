// src/app/api/admin/users/route.ts
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

// GET all users (with optional search)
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } }
    ]
  }).sort({ createdAt: -1 });

  return NextResponse.json(users, { status: 200 });
}

// PUT (Update role or user details)
export async function PUT(req: NextRequest) {
  await connectDB();
  const { id, role } = await req.json();
  
const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });


  if (!updatedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updatedUser, { status: 200 });
}

// DELETE user
export async function DELETE(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "User deleted" }, { status: 200 });
}
