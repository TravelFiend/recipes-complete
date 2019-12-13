const { Router } = require('express');
const Attempt = require('../models/Attempt');

module.exports = Router()
    .post('/', (req, res) => {
        Attempt
            .create(req.body)
            .then(attempt => res.send(attempt));
    })

    .get('/', (req, res) => {
        Attempt
            .find()
            .select({ notes: false })
            .then(attempts => res.send(attempts));
    })

    .get('/:id', (req, res) => {
        Attempt
            .findById(req.params.id)
            .populate('recipe')
            .then(attempt => res.send(attempt));
    })

    .patch('/:id', (req, res) => {
        Attempt
            .findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(attempt => res.send(attempt));
    })

    .delete('/:id', (req, res) => {
        Attempt
            .findByIdAndDelete(req.params.id)
            .then(attempt => res.send(attempt));
    });
