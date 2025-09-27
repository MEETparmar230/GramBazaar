import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Cart from "@/models/cart";
import { CartItemType } from "@/lib/validations/cart";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const userId = decoded.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find the item to remove
    const itemIndex = cart.items.findIndex(
      (item: CartItemType) => item.productId.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);
    await cart.save();

    return NextResponse.json({ 
      message: "Item removed from cart",
      cart 
    }, { status: 200 });
  } catch (err) {
    console.error("Cart item DELETE error:", err);
    let errorMsg = "Failed to remove item from cart";
    if (err instanceof Error) errorMsg = err.message;
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}