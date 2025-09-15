import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

// Handle cascade deletion without importing Booking model
userSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      // Use mongoose.models to access Booking model if it exists
      const Booking = mongoose.models.Booking;
      if (Booking) {
        await Booking.deleteMany({ user: doc._id });
        console.log(`Deleted all bookings for user ${doc._id}`);
      }
    } catch (error) {
      console.error('Error deleting user bookings:', error);
    }
  }
});

// Additional middleware for other delete operations
userSchema.post('deleteOne', { document: true, query: false }, async function() {
  try {
    // Use mongoose.models to access Booking model if it exists
    const Booking = mongoose.models.Booking;
    if (Booking) {
      await Booking.deleteMany({ user: this._id });
      console.log(`Deleted all bookings for user ${this._id}`);
    }
  } catch (error) {
    console.error('Error deleting user bookings:', error);
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;