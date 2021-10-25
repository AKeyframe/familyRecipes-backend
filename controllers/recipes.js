const express = require('express');
const recipeRouter = express.Router();
const Recipe = require('../models/Recipe');


//Index
recipeRouter.get('/', async (req, res) => {
    try {
      res.json(await Recipe.find({}));
    } catch (error) {
      //bad request
      res.status(400).json(error);
    }
  });

//Create
recipeRouter.post('/', async (req, res) => {
  console.log('--------------------------');
    try {
        console.log(req.body);
        res.json(await Recipe.create(req.body));
    } catch (error) {
        //bad request
        res.status(400).json(error);
    }
});

module.exports = recipeRouter;