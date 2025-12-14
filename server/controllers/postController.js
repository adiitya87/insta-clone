const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
const createPost = async (req, res) => {
    const { imageUrl, caption } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
    }
    try {
        const newPost = await Post.create({
            author: req.user._id,
            imageUrl,
            caption,
        });

// populate author details for frontend response
    const populatedPost = await Post.findById(newPost._id).populate('author', 'username profilePic');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getFeedPosts = async (req, res) => {
    try {
        // Get current user to see who they follow
        const currentUser = await User.findById(req.user._id);
        const followingList = currentUser.following;

        //Add current user's ID to list (so they see their own posts too)
        followingList.push(req.user._id);

        //Find posts where author is in following list
        const posts = await Post.find({ author: { $in: followingList } })
            .sort({ createdAt: -1 }) //most recent first
            .populate('author', 'username profilePic') //populate author details
            .populate('comments.user', 'username profilePic'); //populate comment user details

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.user._id)) {
            await post.updateOne({ $push: { likes: req.user._id } });
            return res.status(200).json({ message: 'Post liked' });
        } else {
            await post.updateOne({ $pull: { likes: req.user._id } });
            return res.status(200).json({ message: 'Post unliked' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const commentOnPost = async (req, res) => {
    const { text } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        const comment = {
            user: req.user._id,
            text,
        };
        post.comments.push(comment);
        await post.save();
        res.status(201).json({ message: 'Comment added' }); 
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createPost, getFeedPosts, likePost, commentOnPost };
