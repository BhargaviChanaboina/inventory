const express = require('express');
const _ = require('lodash');
const product = require('./product');

const router  = express.Router();
const cp = require('cookie-parser');
router.use(cp());

// get all products or filtered products 
router.get('/', (req, res) => {
  const query = req.query || {};
  product.find(query, (er, data) => {
    if (er) res.send(er);
    return res.send(data);
  });
});

// get a specific product along with the warehouse data
// example /product/123
router.get('/:id', (req, res) => {
  const query = req.query || {};
  return product.find({ _id: req.params.id })
          .populate('wareHouse')
          .exec((er, data) => {
            if (er) res.send(er);
            res.json(data);
          });
});

// add a new product
router.post('/add/:warehouseId', (req, res) => {
  if (!req.params.warehouseId) return res.send('Please provide the warehouse Id in the api');
	const prod = new product({
		title: req.body.title,
		price: req.body.price,
		category: req.body.category,
		storage_type: req.body.storage_type,
		compartment: req.body.compartment,
    wareHouse: req.params.warehouseId
		});
	prod.save((er, data) => {
    if (er) res.send(er);
    return res.json(data);
  });
});

// add a new product
router.post('/insertOne', (req, res) => {
  if (!req.body.wareHouse) return res.send('Please provide the warehouse Id in the api');
	const prod = new product({
		title: req.body.title,
		price: req.body.price,
		category: req.body.category,
		storage_type: req.body.storage_type,
		compartment: req.body.compartment,
    wareHouse: req.body.wareHouse
		});
	prod.save((er, data) => {
    if (er) res.send(er);
    return res.json(data);
  });
});

// add multiple products to a single warehouse
router.post('/addMany/:warehouseId', (req, res) => {
  const body = req.body;
  if (!Array.isArray(body)) return res.send('Please add multiple products');
  if (!req.params.warehouseId) return res.send('Please provide the warehouse Id in the api');
  if (!body.length) return res.json([]);
  body.forEach(record => {
    record.wareHouse = req.params.wareHouseId;
  });
  product.insertMany(body, { ordered: false }, (er, data) => {
    if (er) res.send(er);
    return res.json(data);
  });
});

// add multiple products to different warehouses
router.post('/insertMany', (req, res) => {
  const body = req.body;
  if (!Array.isArray(body)) return res.send('Please add multiple products');
  if (!body.length) return res.json([]);
  product.insertMany(body, { ordered: false }, (er, data) => {
    if (er) res.send(er);
    return res.json(data);
  });
});

//update a product
router.put('/:id', (req, res) => {
  product.updateOne({ _id: req.params.id}, req.body, (er, result) => {
    if (er) return res.send(er);
    return res.json(result);
  });
});

//delete products
// deletes all the records that matches the query exactly
router.delete('/', (req, res) => {
  if (!req.query || !Object.keys(req.query).length) return res.send('Please add query params to delete');
  product.deleteMany(req.body.query, (er, response) => {
    if (er) return res.send(er);
    return res.json(response);
  });
});
module.exports = router;