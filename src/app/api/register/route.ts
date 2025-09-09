import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { signUpSchema } from "@/lib/validations/register";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, phone ,confirmPassword} = await req.json();

    const validation = signUpSchema.safeParse({name, email, password, phone,confirmPassword})

    if(!validation.success){
      console.error("validation failed",validation.error)
      return NextResponse.json({error:"Validation failed"},{status:401})
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user._id },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Registration error:", error.message);
      return NextResponse.json(
        { error: "Registration failed: " + error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error during registration.");
      return NextResponse.json(
        { error: "An unknown error occurred during registration." },
        { status: 500 }
      );
    }
  }
}
