const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connect } = require('./config/database');
const {auth} = require('./middleware/auth');

//controllers
const {registerUser, loginUser, followUser, unfollowUser} = require('./controllers/userController');
const {createPost, getFeedPosts, likePost, commentOnPost} = require('./controllers/postController');

//config
dotenv.config();
connect();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes

//Auth routes
app.post('/api/users/signup', registerUser);
app.post('/api/users/login', loginUser);

//user action routes
app.put('/api/users/follow/:id', auth, followUser);
app.put('/api/users/unfollow/:id', auth, unfollowUser);

//post routes
app.post('/api/posts', auth, createPost);
app.get('/api/posts/feed', auth, getFeedPosts);
app.put('/api/posts/like/:id', auth, likePost);
app.post('/api/posts/comment/:id', auth, commentOnPost);

//root route
app.get('/', (req, res) => {
    res.send('Instagram API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


