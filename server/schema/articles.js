const mongoose = require('mongoose');
const articleSchema = mongoose.Schema({
	id: String,
	title:String,
	create_time:String,
	update_time:String,
	md_content:String,
	html_content:String,
	title:String,
	page_view_count: Number,
	page_view_time: [],
	user_view:[],
	user_view_count:Number,
	comment:[],
	comment_count: Number

})
module.exports = articleSchema
