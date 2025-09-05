import { connectDB } from "@/lib/db"
import Message from "@/models/message"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return NextResponse.json(
      { success: false, message: "No ID provided" },
      { status: 400 }
    )
  }

  try {
    await connectDB()

    const result = await Message.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      console.error("Message not found to delete")
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      )
    }

    console.log("Message deleted for id:", id)
    return NextResponse.json(
      { success: true, message: "Message deleted", data: result },
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
