import { NextRequest, NextResponse } from "next/server";
import Product from '@/models/product'
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";



export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id
    await connectDB()

    try {
        const product = await Product.findById(productId)

        if (!product) {

            return NextResponse.json({ message: "Can't find Product" }, { status: 401 })

        }

        return NextResponse.json({ message: "Product Fetched", product }, { status: 200 })
    }
    catch (err) {
        console.error("Some error occured while fetching a product from database")
        return NextResponse.json({ message: "Some error occured while fetching a product from database" }, { status: 500 })

    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

    const productid = params.id;
    const product = await req.json()

    if (!product || Object.keys(product).length === 0) {
        return NextResponse.json({ message: "no data arrived to apu for update" }, { status: 400 })
    }

    await connectDB()

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productid, product, { new: true })

        if (!updatedProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Product Updated!!", product: updatedProduct }, { status: 200 })
    }
    catch (err) {
        console.error("Error while updating product", err)
        return NextResponse.json({ message: "Failed to update Product" }, { status: 500 })
    }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id; 

  if (!id) {
    return NextResponse.json(
      { message: "Product ID not provided" },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // If product had an image, clean it from Cloudinary
    if (deleted.imageId) {
      try {
        const result = await cloudinary.uploader.destroy(deleted.imageId);

        if (result.result !== "ok" && result.result !== "not found") {
          console.error("Cloudinary deletion issue:", result);
          return NextResponse.json(
            { message: "Unable to delete image from cloud" },
            { status: 500 }
          );
        }
      } catch (cloudErr) {
        console.error("Error deleting image from Cloudinary:", cloudErr);
        return NextResponse.json(
          { message: "Error deleting image from Cloudinary" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting product:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
