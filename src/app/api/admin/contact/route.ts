// api/admin/contact/route.ts
import { connectDB } from "@/lib/db"
import Message from "@/models/message"
import { NextRequest, NextResponse } from "next/server"


export async function GET() {
  try {
    await connectDB()

    const messages = await Message.find().sort({ createdAt: -1 }) // latest first

    return NextResponse.json(
      { success: true, data: messages },
      { status: 200 }
    )
  } catch (err) {
    console.error("Failed to fetch messages", err)
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ids } = body 

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 }
      )
    }

    await connectDB()

    const result = await Message.deleteMany({ _id: { $in: ids } })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "No messages found to delete" },
        { status: 404 }
      )
    }

    console.log("messages deleted of these ids",result)
    return NextResponse.json(
      {
        success: true,
        message: `${result.deletedCount} message(s) deleted`,
        data: result,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("Internal server error", err)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
