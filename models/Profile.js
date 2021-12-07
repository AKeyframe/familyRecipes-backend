const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const profileSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    
    first: String,
    last: String,
    recipes: [{type: Schema.Types.ObjectId, ref: 'Recipe'}],
    favorites: [{type: Schema.Types.ObjectId, ref: 'Recipe'}],
    families: [{type: Schema.Types.ObjectId, ref: 'Family'}],
    requests: [{type: Schema.Types.ObjectId, ref: 'Family'}],
});




const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;