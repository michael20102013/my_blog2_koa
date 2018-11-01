const mongoose = require('mongoose');
const articleSchema = mongoose.Schema({
	id: String,
	title:String,
	create_time:String,
	update_time:String,
	content:String,
	title:String
})
module.exports = articleSchema
