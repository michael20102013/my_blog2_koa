const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
	name: String,
	password:String,
	token:String
})
module.exports = userSchema
