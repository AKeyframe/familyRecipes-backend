const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familySchema = new Schema({
    name: String,
    head: String,
    members: [{type: String}],
    whoCanInvite: String,
});

const Family = mongoose.model('Family', familySchema);

module.exports = Family;