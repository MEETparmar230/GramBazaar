import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed", "Cancelled"],
      default: "Pending",
    },
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    shippingAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    trackingNumber: String,
    cancellationReason: String,
  },
  { timestamps: true }
);

// Calculate total amount before saving
bookingSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((total, item) => {
    const price = item.price ?? 0;  
    const qty = item.quantity ?? 1; 
    return total + price * qty;
  }, 0);
  next();
});


const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;