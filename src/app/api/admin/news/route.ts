import { connectDB } from '@/lib/db'
import { newsSchema } from '@/lib/validations/news'
import News from '@/models/news'
import { NextRequest, NextResponse } from 'next/server'



export async function POST(req:NextRequest){
   try{
    const news = await req.json()

      if(!news){
        console.log("Didn't Recieve news from Client")
        return NextResponse.json({message:"Didn't Recieve news from Client"},{status:404})
    }

      if (news.date && typeof news.date === 'string') {
      news.date = new Date(news.date)
    }

    const validation = newsSchema.safeParse(news)

    if(!validation.success){
        console.error("invalid Input",validation.error)
        return NextResponse.json({message:"invalid Input",errors:validation.error.issues},{status:400})
    }

  
   await connectDB()



    const newNews = await News.create(validation.data)

    if(!newNews){
        console.error("Unable to create news")
        return NextResponse.json({message:"Unable to create news"},{status:400})
    }

    return NextResponse.json({ 
      message: "News created successfully", 
      data: newNews 
    },{status:201})

   }
   catch(err){
        console.error("Internal server Error",err)
        return NextResponse.json({message:"Internal server Error"},{status:500})

   }

}