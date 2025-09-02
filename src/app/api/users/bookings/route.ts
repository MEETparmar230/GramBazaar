import { connectDB } from '@/lib/db';
import Booking from '@/models/booking';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface JwtPayload {
  userId: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get token from cookies
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;

    // Parse request body
    const { items } = await req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Create new booking
    const booking = new Booking({
      user: userId,
      items,
      totalAmount,
      status: 'confirmed'
    });

    await booking.save();

    // Populate user details for response
    await booking.populate('user', 'name email');

    return NextResponse.json(
      { 
        message: 'Booking created successfully', 
        booking 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}