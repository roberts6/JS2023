import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"

const cartSchema = new mongoose.Schema({
    items: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    id_usuario: {
      type: String, 
      required: true,
      index: true
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
      index: true
    }
  });
  
  userSchema.plugin(mongoosePaginate)
  userSchema.index({ id_usuario: 1, fecha_creacion: 1 });
  

  const Cart = mongoose.model('Cart', cartSchema);
  
  export default Cart;
  