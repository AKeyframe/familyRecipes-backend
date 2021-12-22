const express = require('express');
const profileRouter = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Family = require('../models/Family');


//Add a favorite
profileRouter.put('/:id/favorite', async (req, res) => {
    const recipeId = req.body.id;
    const profileId = req.params.id;

    Profile.findById(profileId, (error, userProfile) =>{
        userProfile.favorites.push(recipeId);
        userProfile.save();

        try{
            res.json(userProfile);
        } catch (err){
            console.log(err);
        }
    });
});

//Accept or Decline a Family Request
profileRouter.put('/request/:id', (req, res) => {
    const dec = req.body.dec;
    const famID = req.body.famID;
    const reqID = req.body.reqID;
    const profID = req.body.profID;
    
    if(dec === 'accept'){
        console.log('accepted')
        let idx = 0;
        Profile.findById(profID, (error, userProfile) => {
            userProfile.requests.some((r, i) => {
                if(r._id == reqID){
                    idx = i;
                    return true;
                   
                }
                return false;
            });

            if(userProfile.requests.length > 1){
                userProfile.requests = userProfile.requests.splice(idx-1, 1);
            } else {
                userProfile.requests = [];
            }
            userProfile.families.push(famID);
            userProfile.save();

            Family.findById(famID, (e, foundFamily) => {
                foundFamily.members.push(profID);
                foundFamily.save();
            });

            try{
                res.json(userProfile);
            } catch (err) {
                console.log(err);
            }
        });



    } else if(dec === 'decline'){
        console.log('declined')
        let idx = 0;
        Profile.findById(profID, (error, userProfile) => {
            userProfile.requests.some((r, i) => {
                if(r._id == reqID){
                    idx = i;
                    return true;
                   
                }
                return false;
            });

            if(userProfile.requests.length > 1){
                userProfile.requests = userProfile.requests.splice(idx-1, 1);
            } else {
                userProfile.requests = [];
            }
            userProfile.save();

            try{
                res.json(userProfile);
            } catch (err) {
                console.log(err);
            }
        });
    }

});

profileRouter.put('/:username/recieve-request', (req, res) => {
    const username = req.params.username;
    let data = req.body;
    let id = 0;
    let dupe = false;

    User.find({username: username}, async (er, foundUser) => {
        id = foundUser[0].profile;
    
        Profile.findById(id, async (error, userProfile) => {
            userProfile.requests.forEach((r, i) => {
                if(r.from == data.from){
                    dupe = true;
                    console.log('Duplicate, not added')
                }
            });

            if(!dupe){
                console.log('no duplicates found')
                userProfile.requests.push(data);
                userProfile.save();
            }

            try{
                res.json(userProfile);
            } catch (err){
                console.log(err);
            }
        });
    });
});


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
        try{
            res.json(userProfile.families);
        } catch (error) {
            console.log(error);
        }
    });
});


profileRouter.get('/:id', async (req, res) => {
    Profile.findById(req.params.id, (error, userProfile) => {
        try{
            res.json(userProfile)
        } catch (error) {
            console.log(error);
        }

    }).populate('recipes').populate('favorites').populate('requests.from').populate('families'); 
    


});

module.exports = profileRouter;