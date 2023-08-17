const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs=require('fs');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads','images'))); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path,err=>{
     // console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(
    'mongodb://zenitsu:demonslayer@ac-r4i5qi7-shard-00-00.vq7dmvm.mongodb.net:27017,ac-r4i5qi7-shard-00-01.vq7dmvm.mongodb.net:27017,ac-r4i5qi7-shard-00-02.vq7dmvm.mongodb.net:27017/project?ssl=true&replicaSet=atlas-mk8w8g-shard-0&authSource=admin&retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(5000,()=>{
      console.log('running')
    });
  })
  .catch(err => {
    console.log(err);
  });
