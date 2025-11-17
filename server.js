const dotenv = require('dotenv')
dotenv.config();
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const authController = require('./controllers/auth.js')

const app = express();
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(express.json())

app.use('/',authController)

app.listen(3000,()=>{
    console.log('server running on port 3000')
})
