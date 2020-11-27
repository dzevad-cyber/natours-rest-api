import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email invalid'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [8, 'Password needs to be minimum 8 charachters.'],
    select: false,
    trim: true,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm password is required.'],
    validate: {
      validator: function (passwordConfirm) {
        return passwordConfirm === this.password;
      },
      message: "Password doesn't match",
    },
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

const User = mongoose.model('User', userSchema);
export default User;
