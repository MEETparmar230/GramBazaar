import { connectDB } from '@/lib/db';
import Booking from '@/models/booking';
import Product from '@/models/product';
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
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;

    // Parse request body
    const { items } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    // Get product IDs from request
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length === 0) {
      return NextResponse.json({ error: 'No valid products found' }, { status: 400 });
    }

    // Build validated items
    const validatedItems = items.map((i: any) => {
      const product = dbProducts.find((p: any) => p._id.toString() === i.productId);
      if (!product) {
        throw new Error(`Invalid product: ${i.productId}`);
      }
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: i.quantity,
      };
    });

    // Create new booking
    const booking = new Booking({
      user: userId,
      items: validatedItems,
      status: 'Pending', // default from your schema
    });

    await booking.save();
    await booking.populate('user', 'name email');

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating booking:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;

    const bookings = await Booking.find({ user: userId })
      .populate('items.productId', 'name price') // optional: get product details
      .sort({ createdAt: -1 }); // latest first

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}