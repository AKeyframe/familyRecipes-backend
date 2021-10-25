const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    access: String,
    name: String,
    ingredients: [{amount: String, ingred: String}],
    steps: Array,
});


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;