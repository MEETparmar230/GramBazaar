import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json();

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    }

    console.log('Contact submission:', { name, message });

    return NextResponse.json({ success: true, message: 'Message received!' });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
