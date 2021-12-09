const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familySchema = new Schema({
    name: String,
    head: {type: Schema.Types.ObjectId, ref: 'Profile'},
    members: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
    favorites: [{type: Schema.Types.ObjectId, ref: 'Recipe'}],
    whoCanInvite: String,
});

const Family = mongoose.model('Family', familySchema);

module.exports = Family;