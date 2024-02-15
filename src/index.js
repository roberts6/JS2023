import productModel from './models/products.model.js'
import mongoose, { mongo } from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();
const BD_URL = process.env.BD_ATLAS

const environment = async() => {
    await mongoose.connect(BD_URL)
    let response = await productModel.find({title:"Air Jordan 5"}.explain('executionStats'))
    console.log(response)
}

environment()