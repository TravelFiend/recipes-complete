const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Attempt = require('../models/Attempt');

module.exports = Router()
    .post('/', (req, res) => {
        Recipe
            .create(req.body)
            .then(recipe => res.send(recipe));
    })

    .get('/', (req, res) => {
        let recipeSearch = {};
        if(req.query.ingredient) {
            recipeSearch = { 'ingredients.name': req.query.ingredient };
        }

        Recipe
            .find(recipeSearch)
            .select({ name: true })
            .then(recipes => res.send(recipes));
    })

    .get('/:id', (req, res) => {
        Promise.all([
            Recipe.findById(req.params.id),     // This line returns a value that equals the first index of the .then array (line 24)
            Attempt.find({ recipeId: req.params.id })      // second index. .find({}) is similar to SQL WHERE
        ])
            .then(([recipe, attempts]) => {
                res.send({ ...recipe.toJSON(), attempts });
            });
    })

    .patch('/:id', (req, res) => {
        Recipe
            .findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(recipe => res.send(recipe));
    })

    .delete('/:id', (req, res) => {
        Promise.all([
            Recipe.findByIdAndDelete(req.params.id),
            Attempt.deleteMany({ recipeId: req.params.id })
        ])
            .then(([recipe]) => res.send(recipe));
    });
