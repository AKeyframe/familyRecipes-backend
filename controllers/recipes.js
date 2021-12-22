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
    const id = req.params.id;
    Recipe.findByIdAndDelete(id, (error, delRecipe) => {
      Profile.find(
        {$or: [{recipes: id}, {favorites: id}]}, (e, profs) =>{
          if(profs !== undefined){
            profs.forEach((p, i) => {
              let recipeIdx = -1;
              let favoriteIdx = -1;
              
              p.recipes.some((rec, i2) => {
                if(rec == id){
                  recipeIdx = i2;
                  console.log('true');
                  return true;
                }
                return false;
              });

              p.favorites.some((fav, i3) => {
                if(fav == id) {
                  favoriteIdx = i3;
                  return true;
                }
                return false;
              });

              if(recipeIdx !== -1){
                if(p.recipes.length > 1){
                  p.recipes.splice(recipeIdx, 1);
                } else {
                  p.recipes = [];
                }
              }

              if(favoriteIdx !== -1){
                if(p.favorites.length > 1){
                  p.favorites.splice(favoriteIdx, 1);
                } else { 
                  p.favorites = [];
                }
              }

              p.save();


              try {
                res.json(delRecipe);
              } catch (err) {
                res.status(400).json(err);
              }
            });
          }
      });
    });

    
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
  console.log('==============');
  console.log(req.body);
  const id = req.body.creator;
  let response = null;

  Recipe.create(req.body, (error, newRecipe) => {
    Profile.findById(id, (error, userProfile) => {
      console.log(userProfile);
      userProfile.recipes.push(newRecipe._id);
      userProfile.save();
      
      try {
        res.json(newRecipe);
      } catch (error) {
        //bad request
        res.status(400).json(error);
      }
    });//userProfile
  });//newRecipe

  
  
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