const express = require('express');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bodyParser  = require('body-parser');
const config = require('./config');
const product = require('./models/product-crud');
const warehouse = require('./models/warehouse-crud');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json({}));

app.get('/', (req, res) => {
  res.send('I am up');
});
app.use('/product', product);
app.use('/warehouse', warehouse);

const connectToDB = () => new bluebird((resolve, reject) => {
  const mongoURL = 'mongodb://localhost:27017/inventory';
  mongoose.connect(mongoURL, (er) => {
    if (er) return reject(er);
    console.log('Connected to mongo DB server');
    return resolve();
  });
});

const startServer = new bluebird((resolve, reject) => {
  app.listen(config.port, (er) => {
    if (er) return reject(er)
    console.log(`Server listening at port: ${config.port}`);
    return resolve();
  });
});

const start = () => new bluebird((resolve, reject) => {
  connectToDB()
  .then(startServer)
  .catch(e => {
    console.log(e);
  });
});

start();