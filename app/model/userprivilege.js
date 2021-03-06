'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var userprivilegeSchema = new Schema({
	id: ObjectId,
	userprivilegeid: {
		type: Number,
		unique: true
	},
	title: String,
	name: {
		type: String,
		unique: true
	},
	author: {
		type: ObjectId,
		ref: "User"
	},
	description: String,
	extensionattributes: Schema.Types.Mixed,
	random: Number
});

userprivilegeSchema.pre('save', function (next, done) {
	var badname = new RegExp(/\badmin\b|\bconfig\b|\bprofile\b|\bindex\b|\bcreate\b|\bdelete\b|\bdestroy\b|\bedit\b|\btrue\b|\bfalse\b|\bupdate\b|\blogin\b|\blogut\b|\bdestroy\b|\bwelcome\b|\bdashboard\b/i);
	if (this.name !== undefined && this.name.length < 4) {
		done(new Error('User privilege title is too short'));
	}
	// else if(this.name !== undefined && badname.test(this.name) ){
	//     done(new Error('User privilege title('+this.name+') is a reserved word invalid'));
	// }
	else {
		next();
	}
});

userprivilegeSchema.post('init', function (doc) {
	console.log("model - userprivilege.js - " + doc._id + ' has been initialized from the db');
});
userprivilegeSchema.post('validate', function (doc) {
	console.log("model - userprivilege.js - " + doc._id + ' has been validated (but not saved yet)');
});
userprivilegeSchema.post('save', function (doc) {
	// this.db.models.Item.emit('created', this);
	console.log("model - userprivilege.js - " + doc._id + ' has been saved');
});
userprivilegeSchema.post('remove', function (doc) {
	console.log("model - userprivilege.js - " + doc._id + ' has been removed');
});

module.exports = userprivilegeSchema;
