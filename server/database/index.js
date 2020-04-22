const mongoose = require('mongoose');

const User = require('./user');
const Refreshtoken = require('./refreshtoken');

mongoose.connect('mongodb://localhost:27017/testpr001', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
})

mongoose.connection.once('connected', ()=> console.log('connected to mongoDB'));
mongoose.connection.once('disconnected', ()=> console.log('disconnected from mongoDB'));

process.on('SIGINT',()=>{
  mongoose.connection.close(()=>{
    console.log('mongoose disconnected from mongodb through app termination');
    process.exit(0);
  });
});

mongoose.model('User', User);
mongoose.model('Refreshtoken', Refreshtoken);
module.exports=mongoose.connection;