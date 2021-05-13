var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('warehouse', new Schema({
	address: String,
  area: String,
  capacity: Number
})
);

// area refers to the area of warehouse in sqft