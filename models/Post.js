const mongoose = require('mongoose');

const comentSchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
},
    {timeStamps: true},

);

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },

    image: {
        type: String,
    },

    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],    
    },

    comments: {
        type: [comentSchema],
        default: [],    
    
    },
},
    {timeStamps: true},

);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;