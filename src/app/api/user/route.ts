import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// GET user profile
export async function GET(req: Request) {
  try {
    await connectDB();

    const cookie = req.headers.get('cookie') || '';
    const token = cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1];

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId).select('name email phone');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// PUT user profile update
export async function PUT(req: Request) {
  try {
    await connectDB();

    const cookie = req.headers.get('cookie') || '';
    const token = cookie.split('; ').find((c) => c.startsWith('token='))?.split('=')[1];

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { name, phone } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing name or phone' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    ).select('name email phone');

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
