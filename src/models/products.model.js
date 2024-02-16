import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: { type: String, index: true },
    description: String,
    price: Number,
    thumbnail: String,
    code: { type: String, index: true },
    gender: { type: String, index: true },
    stock: Number
});

productsSchema.plugin(mongoosePaginate)
productsSchema.index({ title: 1, code: 1, gender: 1 });

export const productModel = mongoose.model(productsCollection, productsSchema);

