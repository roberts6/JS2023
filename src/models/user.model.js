import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'superadmin'], // Lista de roles permitidos
    default: 'user', // Valor por defecto si no se provee uno
    index: true
  },
  name: {
    type: String,
    lowercase: true,
    index: true
  },
  lastName: {
    type: String,
    lowercase: true,
    index: true
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true // Esto permite que el campo esté ausente o sea único
  }
},
{
  timestamps: true 
});

userSchema.index({ email: 1, role: 1, name: 1, lastName: 1 });

const User = mongoose.model('User', userSchema);

export default User;


