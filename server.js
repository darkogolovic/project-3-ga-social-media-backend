const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const authController = require('./controllers/auth.js')
const userController = require('./controllers/user.js')
const postsController = require('./controllers/posts.js')
const likeCommentController= require('./controllers/likes-comments.js')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



app.use('/',authController);
app.use('/user',userController);
app.use('/posts',postsController);
app.use('/posts',likeCommentController)


app.listen(3000,()=>{
    console.log('server running on port 3000')
})
