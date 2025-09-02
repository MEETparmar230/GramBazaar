import mongoose from "mongoose";
import Booking from "./booking";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true
    },
    password: String,
    phone: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }      
  },
  { timestamps: true }
);

// Correct middleware for handling user deletion
userSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      await Booking.deleteMany({ user: doc._id });
      console.log(`Deleted all bookings for user ${doc._id}`);
    } catch (error) {
      console.error('Error deleting user bookings:', error);
    }
  }
});

// Additional middleware for other delete operations
userSchema.post('deleteOne', { document: true, query: false }, async function() {
  try {
    await Booking.deleteMany({ user: this._id });
    console.log(`Deleted all bookings for user ${this._id}`);
  } catch (error) {
    console.error('Error deleting user bookings:', error);
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;