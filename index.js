const express= require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require("dotenv").config();


const app=express()
app.use(express.json());
app.use(cors());


const PORT= process.env.PORT || 4000
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});



mongoose.connection.on('connected',()=> console.log('connected'))

app.get('/check',(req,res)=>{
    res.send( '<h1>Working </h1>')
})

app.listen(PORT,()=> console.log(`working ${PORT}`))

app.use('/',require('./routes/user.js'))


