import { connectDB } from "@/lib/db"
import Service from '@/models/service'
import { NextResponse } from "next/server"

export async function GET() {
    await connectDB()
    try {
        const services = await Service.find({})
        if (services.length === 0) {
            return NextResponse.json({ error: "No services found" }, { status: 404 })
        }
        return NextResponse.json(services, {status: 200})
    }
    catch (err) {
        console.error("Error fetching services:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
