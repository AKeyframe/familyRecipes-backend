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

profileRouter.get('/:id/families', async (req, res) => {
    const id = req.params.id;


    Profile.findById(id).populate('families').exec((error, userProfile) => {
        console.log(userProfile);
       
        try{
            res.json(userProfile.families);
        } catch (error) {
            console.log(error);
        }
    });

    
});


profileRouter.get('/:id', async (req, res) => {
    Profile.findById(req.params.id, (error, userProfile) => {
        console.log('User Profile')
        console.log(userProfile);
        try{
            res.json(userProfile)
        } catch (error) {
            console.log(error);
        }

    }).populate('recipes'); 
    


});

module.exports = profileRouter;