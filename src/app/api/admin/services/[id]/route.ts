import { connectDB } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import Service from '@/models/service'
import cloudinary from "@/lib/cloudinary"

interface Context {
params:Promise<{id:string}>
}

export async function GET(req:NextRequest,context: Context) {
    const params = await context.params
    const serviceId = params.id


    if (!serviceId) {
        return NextResponse.json({ message: "service id not provided by client" }, { status: 400 })
    }

    await connectDB()

    try {
        const service = await Service.findById(serviceId)

        if (!service) {
            return NextResponse.json({ message: "Service not found" }, { status: 404 })
        }


        return NextResponse.json(service, { status: 200 })
    }
    catch (err) {
        console.error("internl server Error", err)
        return NextResponse.json({ message: "Internal server Error" }, { status: 500 })

    }

}

export async function PUT(req: NextRequest, context: Context) {
    const params = await context.params
    const serviceId = params.id



    if (!serviceId) {
        return NextResponse.json({ message: "service id not provided by client" }, { status: 400 })
    }

    const service = await req.json()

    if (!service || Object.keys(service).length===0) {
        return NextResponse.json({ message: "didn't get service from client" }, { status: 400 })
    }

    await connectDB()

    try {

        const newService = await Service.findByIdAndUpdate(serviceId, service, { new: true })

        if (!newService) {
            return NextResponse.json({ message: "unable to update service" }, { status: 400 })
        }

        return NextResponse.json(newService, { status: 200 })

    }
    catch (err) {
        console.error("internal server Error", err)
        return NextResponse.json({ message: "Internal server Error" }, { status: 500 })

    }

}

export async function DELETE(req:NextRequest,context: Context) {

    const params = await context.params
    const serviceId = params.id

    if (!serviceId) {
        return NextResponse.json({ message: "service id not provided by client" }, { status: 400 })
    }

    await connectDB()

    try {
        const deleted = await Service.findByIdAndDelete(serviceId)
        if (!deleted) {
            return NextResponse.json({ message: "service not found" }, { status: 404 })
        }

        if (deleted.imageId) {

            try {
                const result = await cloudinary.uploader.destroy(deleted.imageId)
                if (result.result !== "ok" && result.result !== "not found") {
                    console.error("unable to delete service image from cloud")
                }

            }
            catch (cloudErr) {
                console.error("Error while deleting service image from cloud", cloudErr)
                return NextResponse.json({ message: "Error deleting image from Cloudinary" }, { status: 500 })

            }
        }

        return NextResponse.json({ message: "service Deleted!!" }, { status: 200 })

    }
    catch (err) {
        console.log("Error while deleting service", err)
        return NextResponse.json({ message: "internal server error" }, { status: 500 })

    }

}