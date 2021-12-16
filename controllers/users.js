const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ObjectID = require("mongodb").ObjectID
const User = require('../models/User');
const Profile = require('../models/Profile');
const Recipe = require('../models/Recipe');
const Family = require('../models/Family');

const secret = process.env.SECRET;

userRouter.delete('/:id', (req, res) => {
    const userId = req.params.id;
    //Find the user and delete it
    //Find that users profile and delete it
    User.findByIdAndDelete(userId, async (error, delUser) => {
        Profile.findByIdAndDelete(delUser.profile, (err, delProfile) => {
            delProfile.families.forEach((fam, idx) => {
                Family.findById(fam, (famError, foundFamily) => {
                    let famIndex = -1;
                    foundFamily.members.some((memb, mi) => {
                        if (memb == delProfile.id) {
                            famIndex = mi;
                            return true;
                        }
                        return false;
                    });

                    if (famIndex !== -1) {
                        if (foundFamily.members.length > 1) {
                            foundFamily.members.splice(famIndex, 1);
                        } else {
                            foundFamily.members = [];
                        }

                        foundFamily.save();
                        
                    }
                });//foundFamily
            });//delProfile Families
            removeFavoritesFromUsers(delProfile.recipes);
            removeUserRecipes(delProfile.recipes);
        }); //delProfile

        try {
            res.json({});
        } catch (catchError) {
            console.log(catchError);
        }
    }); //User 
    
    function removeFavoritesFromUsers(recipes){
        function recToArray(rec){
            let data = [];
            rec.forEach((r, i) => {
                data.push({favorites: r});
            });
            return data;
        }

        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$')
        console.log(recipes);
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$')

        Profile.find({$or: recToArray(recipes)}).exec(
            (profsError, profFavs) => {
                if(profFavs !== undefined){
                    console.log(profFavs)
                    profFavs.forEach((p, i2) => {
                        recipes.forEach((r, i) => {
                            let favIdx = -1;
                            p.favorites.some((f, i3) => {
                                console.log('==============')
                                console.log(f)
                                console.log(typeof f)
                                console.log(f.toString())
                                console.log(r)
                                console.log(typeof r)
                                console.log(toString(r.toString()))
                                console.log('==============')
                                if (f.equals(r)) {
                                    favIdx = i3;
                                    console.log('true')
                                    return true
                                }
                                return false;
                            });
                            console.log(favIdx);
                            if (favIdx !== -1) {
                                if (p.favorites.length > 1) {
                                    p.favorites.splice(favIdx, 1);
                                } else {
                                    p.favorites = [];
                                }
                            }
                            console.log(p.favorites);
                           
                        }); //recipe.forEach()
                        p.save();
                    });//profWithFavs.forEach()
                } else {
                    console.log(profFavs);
                }
        }); //Profile.find

        // recipes.forEach(async (r, i) => {
            
        // });


        /*
            await Profile.find({ favorites: r }, (e, profFavs) => {
                if(profFavs !== undefined){
                    console.log(profFavs)
                    profFavs.forEach(async (p, i2) => {
                        let favIdx = -1;
                        p.favorites.some((f, i3) => {
                            console.log('==============')
                            console.log(f)
                            console.log(typeof f)
                            console.log(f.toString())
                            console.log(r)
                            console.log(typeof r)
                            console.log(toString(r.toString()))
                            console.log('==============')
                            if (f.equals(r)) {
                                favIdx = i3;
                                console.log('true')
                                return true
                            }
                            return false;
                        });
                        console.log(favIdx);
                        if (favIdx !== -1) {
                            if (p.favorites.length > 1) {
                                p.favorites.splice(favIdx, 1);
                            } else {
                                p.favorites = [];
                            }
                        }
                       
                        console.log(p.favorites);
                        Profile.findByIdAndUpdate(p._id, {favorites: p.favorites},
                            (upError, updatedProfile) => {
                                if(updatedProfile) console.log(updatedProfile);
                            });
                    });
                }
                
            }).clone();
        
        
        
        */


    }

    function removeUserRecipes(recipes){
        recipes.forEach((r, i) => {
            Recipe.findByIdAndDelete(r, (delError, deleRecipe) => {
                if(delError) console.log(delError)
            });
        });
    }
}); //Router

userRouter.post('/signup', async (req, res) => {
    let data = req.body;
    let user = null;
    let prof = {};

    User.create(data, (error, newUser) => {
        user = newUser;
        prof = { user: user._id, username: req.body.username }
        Profile.create(prof, (err, newProfile) => {
            newUser.profile = newProfile._id;
            newUser.save();
        });
    });


    try {
        //create the web token for auth
        const token = createJWT(user);
        res.json({ token });

    } catch (err) {

        res.status(400).json(err);
    }
});

userRouter.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({ username: req.body.username });
        if (!user) res.status(401).json({ err: 'Bad Credentials' });

        let isMatch = bcrypt.compareSync(req.body.pw, user.password)

        if (isMatch) {
            const token = createJWT(user);
            res.json({ token });

        } else {
            return res.status(401).json({ err: 'Bad Credentials' });
        }

    } catch (err) {
        return res.status(401).json(err);
    }
})

//////////////////////////////////////////////


//////////////////////////////////////////////
function createJWT(user) {
    return jwt.sign({ user }, secret, { expiresIn: '24h' });
}


module.exports = userRouter;