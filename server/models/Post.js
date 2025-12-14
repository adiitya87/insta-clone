const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
imageUrl: {
    type: String,
    required: [true, 'Post must have image URL']
  },
caption: {
    type: String,
    maxlength: 2200,
    trim: true,
  },

 //array to store IDs of users who liked the post 
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

//embedded comments for simple fetching
comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      createdAt: { type: Date, default: Date.now },
    },
],
}, { timestamps: true }); //automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('Post', postSchema);