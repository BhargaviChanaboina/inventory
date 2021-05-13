const express = require('express');
const _ = require('lodash');
const warehouse = require('./warehouse');
const product = require('./product');
const bluebird = require('bluebird');

const router  = express.Router();
const cp = require('cookie-parser');
router.use(cp());

// get details of all warehouses
router.get('/', (req, res) => {
  const query = req.query || {};
  warehouse.find(query, (er, data) => {
    if (er) res.send(er);
    return res.send(data);
  });
});

// get details of a particular warehouse
router.get('/:id', (req, res) => {
  warehouse.find({ _id: req.params.id }, (er, data) => {
    if (er) res.send(er);
    res.send(data);
  });
});

const reshapeData = (products, warehouse) => {
  if (!products || !Array.isArray(products)) return products;
  const filter = (compartment) => {
    return products.filter(prod => {
      return prod.compartment === compartment;
    });
  }
  const obj = warehouse ? JSON.parse(JSON.stringify(warehouse)) : {};
  obj.available = filter('available');
  obj.damaged = filter('damaged');
  obj.reserved = filter('reserved');
  return obj;
}

const getProducts = (query, warehouse) => new bluebird((resolve, reject) => {
  product.find(query, (er, data) => {
    if (er) return reject(er);
    if (!data.length) return resolve(warehouse || data);
    const res = reshapeData(data, warehouse);
    return resolve(res);
  });
});

// get all products details of a particular warehouse 
router.get('/products/:q', (req, res) => {
  const obj = {
    wareHouse: req.params.q
  }
  Object.keys(req.query).forEach(key => {
    obj[key] = req.query[key];
  });
  return getProducts(obj)
  .then((reshapedData) => res.json(reshapedData))
  .catch(e => res.send(e));
});

// get products of all warehouses
router.get('/inventory/all', (req, res) => {
  warehouse.find({}, (er, warehouses) => {
    if (er) return res.send(er);
    console.log(er, warehouse);
    if (!warehouses || !Array.isArray(warehouses)) return res.json([]);
    const promises = [];
    console.log(warehouses);
    warehouses.forEach(w => promises.push(getProducts({ wareHouse: w._id }, w)));
    bluebird.all(promises)
    .then((response) => res.json(response))
    .catch(e => res.send(e));
  });
});

// add a new ware house
router.post('/add', (req, res) => {
	const wareHouse = new warehouse({
		address: req.body.address,
		area: req.body.area,
		});
    wareHouse.save((er, data) => {
    if (er) res.send(er);
    return res.json(data);
  });
});
module.exports = router;