import { connectDB } from '@/lib/db'
import News from '@/models/news'
import { NextRequest, NextResponse } from 'next/server'
import {newsSchema} from '@/lib/validations/news'


interface Contex{
    params:Promise<{
        id:string
    }>
}


export async function GET(req:NextRequest,context:Contex){
    const params = await context.params
    const id = params.id

    if(!id){
        console.log("didn't get id from client")
        return NextResponse.json({message:"didn't get id from client"},{status:400})
    }

    try{
      await connectDB()

        const news = await News.findById(id)

        if(!news){
            console.error("News not found")
            return NextResponse.json({message:"News not found"},{status:404})
        }

        return NextResponse.json({message:"news fetched successfully!!",news},{status:200})

        

    }
    catch(err){
        console.error("internal server error while fetching news data")
        return NextResponse.json({message:"unable to fetch data"},{status:500})

    }
}

export async function PUT(req:NextRequest,context:Contex){
 const params = await context.params
    const id = params.id

     if(!id){
        console.log("didn't get id from client")
        return NextResponse.json({message:"didn't get id from client"},{status:400})
    }

    try{

        const body = await req.json()

        if(!body || Object.keys(body).length===0){
            console.log("no data arrived from client to update")
            return NextResponse.json({message:"no data arrived from client to update"},{status:400})
        }
        if (body.date && typeof body.date === "string") {
  body.date = new Date(body.date)
}
        const validation = newsSchema.safeParse(body)

        if(!validation.success){
            console.error("Invalid Input",validation.error)
            return NextResponse.json({message:"Invalid Input",errors:validation.error.issues},{status:400})
        }

      await connectDB()

      const updated = await News.findByIdAndUpdate(id,validation.data)

      if(!updated){
        console.error("News not found")
        return NextResponse.json({message:"News not found"},{status:404})
      }

        return NextResponse.json({message:"News Updated!!",news:updated},{status:200})
    }
    catch(err){
        console.error("internal server error while updating news")
        return NextResponse.json({message:"internal server error"},{status:500})

    }



}

export async function DELETE(req:NextRequest,context:Contex){
 const params = await context.params
    const id = params.id

     if(!id){
        console.log("didn't get id from client")
        return NextResponse.json({message:"didn't get id from client"},{status:400})
    }

    try{
       await connectDB()

       const deleted = await News.findByIdAndDelete(id)

       if(!deleted){
        console.error("News not found")
        return NextResponse.json({message:"News not found"},{status:404})
      }

    return NextResponse.json({message:"News Deleted!!",deleted},{status:200})


    }
      catch(err){
        console.error("internal server error while deleting news")
        return NextResponse.json({message:"internal server error"},{status:500})

    }
}