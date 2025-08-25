    import { connectDB } from "@/lib/db";
    import Service from '@/models/service'
    import { NextRequest, NextResponse } from "next/server";


    export async function GET() {
        await connectDB()
        try {
            const services = await Service.find({})
            if (!services) {
                return NextResponse.json({ message: "servies not found" }, { status: 400 })
            }
            return NextResponse.json(services,{status:200})
        }
        catch (err) {
            console.error("internal server Error while fetching Services", err)
            return NextResponse.json({ message: "internal server Error while fetching Services" }, { status: 500 })
        }
    }

    export async function POST(req:NextRequest) {

        await connectDB()

        const service =await req.json()

        if(!service || Object.keys(service).length===0){
            return NextResponse.json({ message: "did't get service from client" }, { status: 400 })
        }

        try{
            const newService = await Service.create(service)

            if(!newService){
            return NextResponse.json({ message: "unable to create service" }, { status: 400 })
            }

            return NextResponse.json(newService, { status: 200 })

        }
        catch(err){
            console.log("internal server Error",err)
            return NextResponse.json({ message: "internal server err" }, { status: 500 })

            }
        }
