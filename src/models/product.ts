import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  imageUrl:{ type:String ,required:true },
  imageId:{ type:String ,required:true }
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
