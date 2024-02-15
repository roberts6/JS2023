import mongoose from "mongoose";

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: { type: String, index: true },
    description: String,
    price: Number,
    thumbnail: String,
    code: { type: String, index: true },
    stock: Number
});

productsSchema.index({ title: 1, code: 1 });

export const productModel = mongoose.model(productsCollection, productsSchema);

