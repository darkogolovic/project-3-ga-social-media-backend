const mongoose = require ('mongoose');

const conversationSchema = new mongoose.Schema({

    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
        
    },
},
    {timeStamps: true},
    
);

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;