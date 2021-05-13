var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('product', new Schema({
	'title': {
    type: String,
    required: true
  },
  'price': Number,
  'category': String,
  'wareHouse': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'warehouse',
    required: true,
  },
  'storage_type': String,
  'compartment': {
    type: String,
    required: true
  }
})
);