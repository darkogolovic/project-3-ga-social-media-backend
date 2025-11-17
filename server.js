const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const app = express();
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.listen(3000,()=>{
    console.log('server running on port 3000')
})
