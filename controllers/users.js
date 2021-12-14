const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Recipe = require('../models/Recipe');

const secret = process.env.SECRET;

userRouter.delete('/:id', (req, res) => {
    const userId = req.params.id;
    User.findByIdAndDelete(userId, (error, delUser) => {
        Profile.findByIdAndDelete(delUser.profile,(err, delProfile) =>{
            delProfile.recipes.forEach((recipe, i) => {
                Profile.find({favorites: recipe}, (e, profWithFavs) => {
                    
                });//profWithFavs
                Recipe.findByIdAndDelete(recipe);
            });//ForEach
        }); //Profile
    }); //User
}); //Router

userRouter.post('/signup', async (req, res) => {
    let data = req.body;
    let user = null;
    let prof = {};

    User.create(data, (error, newUser) => {
        user = newUser;
        prof = {user: user._id, username: req.body.username}
        Profile.create(prof, (err, newProfile) => {
            newUser.profile = newProfile._id;
            newUser.save();
        });
    });

    
    try {
        //create the web token for auth
        const token = createJWT(user);
        res.json({token});
        
    } catch (err) {
        
        res.status(400).json(err);
    }
});

userRouter.post('/login', async (req, res) => {
    try{
        
        const user = await User.findOne({username: req.body.username});
        if(!user) res.status(401).json({err: 'Bad Credentials'});
    
        let isMatch = bcrypt.compareSync(req.body.pw, user.password)
        
            if(isMatch) {
                const token = createJWT(user);
                res.json({token});
                
            } else {
                return res.status(401).json({err: 'Bad Credentials'});
            }
        
    } catch (err) {
        return res.status(401).json(err);
    }
})

//////////////////////////////////////////////


//////////////////////////////////////////////
function createJWT(user) {
    return jwt.sign({user}, secret, {expiresIn: '24h'});
}


module.exports = userRouter;