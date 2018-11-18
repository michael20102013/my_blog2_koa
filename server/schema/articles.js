const mongoose = require('mongoose');
const articleSchema = mongoose.Schema({
	id: String,
	title:String,
	create_time:String,
	update_time:String,
	content:String,
	title:String,
	page_view_count: Number,
	page_view_time: [],
	user_view:[],
	comment:[]

})
module.exports = articleSchema
