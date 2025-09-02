import { connectDB } from "@/lib/db"
import News from '@/models/news'
import { NextResponse } from "next/server"

export async function GET(){


   await connectDB()

    try{
        const news = await News.find({})

        if(!news || news.length===0){
            console.log("unable extract News from Database")
          return NextResponse.json({message:"unable extract News from Database"},{status:404})
        }

        return NextResponse.json(news,{status:200})

    }
    catch(err){
        console.error("Error while fetching News",err)
        return NextResponse.json({message:"Server Error while fetching News"},{status:500})
    }

}