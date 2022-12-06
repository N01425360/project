// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
restaurantSchema = new Schema({
   
        _id : String,
		address :String,
		borough : String,
		cuisine :String,
		grades : String,
		name : String ,
		restaurant_id: Number
		
});
module.exports = mongoose.model('restaurant', restaurantSchema);
