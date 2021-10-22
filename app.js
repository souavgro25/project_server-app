const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const user=require('./routes/user');
const frontRoute=require('./routes/frontRoutes');
const category=require('./routes/category')
const product=require('./routes/Product')
const PORT=5000;
const app=express();
//database connection
mongoose.connect('mongodb://localhost:27017/mern_project', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDb Connected");
});
app.use(cors());//cross orgin request
app.use(express.json());//parse post data
app.use(express.static('uploads'));

app.use('/api/product',product)
app.use('/api/user',user);
app.use('/api/category',category);
app.use('/api/main',frontRoute);
app.listen(PORT,()=>{
    console.log(`Work on ${PORT}`)
})