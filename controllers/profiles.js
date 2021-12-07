const express = require('express');
const profileRouter = express.Router();
const Recipe = require('../models/Recipe');
const Profile = require('../models/Profile');




profileRouter.get('/:id/recipes', async (req, res) => {
    const id = req.params.id;
    let recipes = [];

    Profile.findById(id).populate('recipes').exec((error, userProfile) => {
        recipes = userProfile.recipes;
    });
    
    try{
      res.json(await recipes);
    } catch (error){
        console.log(error);
    }
});


profileRouter.get('/:id', async (req, res) => {
    
    try{
        res.json(await Profile.findById(req.params.id).populate('recipes'));
    } catch (error) {
        console.log(error);
    }


});

module.exports = profileRouter;