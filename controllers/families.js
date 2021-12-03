const express = require('express');
const familyRouter = express.Router();
const Family = require('../models/Family');


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
    try {
        res.json(await Family.create(req.body));
    } catch (error) {
        //bad request
        res.status(400).json(error);
    }
});

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