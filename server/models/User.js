const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  
  //arrays to store IDs of users
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  profilePic: {
    type: String,
    default: 'https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg',
  },
}, { timestamps: true }); //automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
