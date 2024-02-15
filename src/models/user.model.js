import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'superadmin'], // Lista de roles permitidos
    default: 'user' // Valor por defecto si no se provee uno
  },
  name: {
    type: String,
    lowercase: true
  },
  lastName: {
    type: String,
    lowercase: true
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

const User = mongoose.model('User', userSchema);

export default User;


