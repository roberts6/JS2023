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
  role: "",
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
    sparse: true
  }
}, 
{
  timestamps: true 
});

const User = mongoose.model('User', userSchema);

export default User;

