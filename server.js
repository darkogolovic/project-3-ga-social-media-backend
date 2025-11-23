const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')
const express = require('express')
const app = express();
const cors = require('cors')
const authController = require('./controllers/auth.js')
const userController = require('./controllers/user.js')
const postsController = require('./controllers/posts.js')
const likeCommentController= require('./controllers/likes-comments.js')
const conversationsController = require('./controllers/conversation.js')
const http = require("http");
const server = http.createServer(app);
const socketServer = require("./socket/socket.js");
const messagesContorller= require('./controllers/messages.js')
const PORT = process.env.PORT || 300

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



app.use('/',authController);
app.use('/user',userController);
app.use('/posts',postsController);
app.use('/posts',likeCommentController);
app.use('/conversations',conversationsController);
app.use('/messages',messagesContorller)

socketServer(server);
server.listen(PORT,()=>{
    console.log('server running on port 3000')
})
