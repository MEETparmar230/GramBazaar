import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from '@/models/product'



export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const product = await req.json();

    // Validation
    if (!product.name || !product.price || !product.imageUrl) {
      return NextResponse.json(
        { message: "Missing required product fields" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create(product);

    return NextResponse.json(
      { message: "New product added", product: newProduct },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error while creating product", err);
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}
