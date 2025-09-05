import { contactSchema } from '@/lib/validations/message';
import { NextRequest, NextResponse } from 'next/server';
import Message from '@/models/message'
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length===0) {
      console.error("No message arrived to Backend")
      return NextResponse.json({success:false,message:"No message arrived to Backend"}, { status: 400 });
    }

    const parsed = contactSchema.safeParse(body)
    
    if(!parsed.success){
      console.error("Data is not valid")
      return NextResponse.json({success:false,message:"Data is not valid",errors:parsed.error.issues}, { status: 400 });
    }

   await connectDB()

    const message = await Message.create(parsed.data)
    if(!message){

      console.error("unable to save message to database")
      return NextResponse.json({success:false,message:"unable to save message to database"}, { status: 400 });

    }
    console.log('Message received!',message)
    return NextResponse.json({success:true,message: 'Message received!' },{status:200});
    
  } catch (err) {
    console.error(err)
    return NextResponse.json({success:false, message: 'Internal Server error' }, { status: 500 });
  }
}
