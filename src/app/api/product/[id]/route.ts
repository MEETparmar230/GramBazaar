import { NextRequest, NextResponse } from "next/server";
import Product from '@/models/product';
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest, context: any) {  // use `any` or leave untyped
  const { params } = context;
  const productId = params.id;

  await connectDB();

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: "Can't find Product" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product Fetched", product }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  const { params } = context;
  const productId = params.id;
  const product = await req.json();

  if (!product || Object.keys(product).length === 0) {
    return NextResponse.json({ message: "No data provided for update" }, { status: 400 });
  }

  await connectDB();

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, product, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product Updated!", product: updatedProduct }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const { params } = context;
  const id = params.id;

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
