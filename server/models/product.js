import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    product_img_url: { type: String, required: true },
    category: { type: String, required: true },
    farmName: { type: String, required: true }, // New field for farm name
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

export const Product = mongoose.model('Product', productSchema);

export default Product;