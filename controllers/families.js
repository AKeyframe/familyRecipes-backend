const express = require('express');
const familyRouter = express.Router();
const Family = require('../models/Family');
const Profile = require('../models/Profile');


familyRouter.get('/', async (req, res) => {
    const famIds = req.body;
    const userFamilies = [];

    famIds.forEach((id, i) => {
        userFamilies.push(Family.findById(id));
    });

    try{
        res.json(await userFamilies);
    } catch (error) {
        res.status(400).json(error);
    }

});


//Delete
familyRouter.delete('/:id', async (req, res) => {
    try {
        res.json(await Family.findByIdAndDelete(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

//Update
familyRouter.put('/:id', async (req, res) =>{
    try {
        res.json(
          await Family.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
      } catch (error) {
        res.status(400).json(error);
      }
});


//Create
familyRouter.post('/', async (req, res) => {
    const head = req.body.head;
    let response = {};
    await Family.create(req.body, (error, newFamily) => {
        response = newFamily;

        Profile.findById(head, (err, headProfile) =>{
            headProfile.families.push(newFamily._id);
            headProfile.save();
        });

    });


    try {
        res.json(response);
    } catch (error) {
        //bad request
        res.status(400).json(error);
    }
});

familyRouter.get('/:id/recipes', async (req, res) => {
    const id = req.params.id;
    const familyRecipes = [];

    Family.findById(id).populate({
        path: 'members',
        populate: {
            path: 'recipes',
            model: 'Recipe'
        }
    }).exec((error, foundFamily) => {
        console.log('============================')
        console.log(foundFamily.members)
        console.log('============================')
        foundFamily.members.forEach((mem, i) => {
            mem.recipes.forEach((r, i2) => {
                familyRecipes.push(r);
            });//mem.forEach
        });//foundFamily.forEach

        console.log(familyRecipes);

        try{
            res.json(familyRecipes);
        } catch (error){
            console.log(error);
        }
    }); //Family.find
});//familyRouter

//Show
familyRouter.get('/:id', async (req, res) => {
    try {
        res.json(await Family.findById(req.params.id));
    } catch (error) {
        //bad request
        res.status(400).json(error);
    }
});




module.exports = familyRouter;