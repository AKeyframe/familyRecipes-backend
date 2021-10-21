const express = require('express');
const userRouter = express.Router();
const User = require('../models/User');


userRouter.post('/signup', async (req, res) => {
    console.log('Signup req.body');
    console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();
        
        res.json(user);
    } catch (err) {
        
        res.status(400).json(err);
    }
});

module.exports = userRouter;