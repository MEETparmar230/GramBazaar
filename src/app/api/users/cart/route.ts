import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Cart from "@/models/cart";
import { CartItemType } from "@/lib/validations/cart";
import Product from "@/models/product";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const userId = decoded.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(cart);
  } catch (err) {
    console.error("Cart GET error:", err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const userId = decoded.userId;

    const { items } = await req.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const { productId, quantity } = items[0];

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            productId,
            name: product.name,
            price: product.price,
            quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item: CartItemType) => item.productId.toString() === productId.toString()
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          price: product.price,
          quantity,
        });
      }

      await cart.save();
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (err) {
    console.error("Cart POST error:", err);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

// Add this DELETE function to your existing api/users/cart/route.ts file

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const userId = decoded.userId;

    // Clear the cart by removing all items
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true }
    );

    return NextResponse.json({ 
      message: "Cart cleared successfully",
      items: []
    }, { status: 200 });

  } catch (err) {
    console.error("Cart DELETE error:", err);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}