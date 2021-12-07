const express = require('express');
const recipeRouter = express.Router();
const Recipe = require('../models/Recipe');
const Profile = require('../models/Profile');


//Index
recipeRouter.get('/', async (req, res) => {
    try {
      res.json(await Recipe.find({}));
    } catch (error) {
      //bad request
      res.status(400).json(error);
    }
  });

//Delete
recipeRouter.delete('/:id', async (req, res) => {
    try {
        res.json(await Recipe.findByIdAndDelete(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

//Update
recipeRouter.put("/:id", async (req, res) => {
    try {
      res.json(
        await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error);
    }
});

//Create
recipeRouter.post('/', async (req, res) => {
  const id = req.body.creator;
  let response = null;

  Recipe.create(req.body, (error, newRecipe) => {
    response = newRecipe;

    Profile.findById(id, (error, userProfile) => {
      userProfile.recipes.push(newRecipe._id);
      userProfile.save();
      
    });//userProfile
  });//newRecipe

  try {
    res.json(await response);
  } catch (error) {
    //bad request
    res.status(400).json(error);
  }
});//recipeRouter


//Show
recipeRouter.get('/:id', async (req, res) => {
    try {
        res.json(await Recipe.findById(req.params.id));
    } catch (error) {
        //bad request
        res.status(400).json(error);
    }
});

module.exports = recipeRouter;