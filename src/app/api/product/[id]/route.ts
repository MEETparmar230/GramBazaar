import { NextRequest, NextResponse } from "next/server";
import Product from '@/models/product';
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

// Define the context type
interface ParamsContext {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, context: ParamsContext) {
  const { id } = context.params;

  await connectDB();

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Can't find Product" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product Fetched", product }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: ParamsContext) {
  const { id } = context.params;
  const product = await req.json();

  if (!product || Object.keys(product).length === 0) {
    return NextResponse.json({ message: "No data provided for update" }, { status: 400 });
  }

  await connectDB();

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product Updated!", product: updatedProduct }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: ParamsContext) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ message: "Product ID not provided" }, { status: 400 });
  }

  await connectDB();

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    if (deleted.imageId) {
      try {
        await cloudinary.uploader.destroy(deleted.imageId);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
