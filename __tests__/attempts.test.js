require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const Attempt = require('../lib/models/Attempt');
const Recipe = require('../lib/models/Recipe');

describe('event routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let recipe;
    beforeEach(async() => {
        recipe = await Recipe.create({
            name: 'cookies',
            directions: [
                'preheat oven to 375',
                'mix ingredients',
                'put dough on cookie sheet',
                'bake for 10 minutes'
            ],
            ingredients: [{
                amount: 3,
                measurement: 'teaspoons',
                name: 'sugar'
            }]
        });
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('creates an attempt', () => {
        return request(app)
            .post('/api/v1/attempts')
            .send({
                recipeId: recipe._id,
                dateOfEvent: Date.now(),
                notes: 'did things',
                rating: 4
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    recipeId: recipe._id.toString(),
                    dateOfEvent: expect.any(String),
                    notes: 'did things',
                    rating: 4,
                    __v: 0
                });
            });
    });

    it('gets all attempts', async() => {
        const attempts = await Attempt.create([
            { recipeId: recipe._id, dateOfEvent: Date.now(), rating: 4 },
            { recipeId: recipe._id, dateOfEvent: Date.now(), rating: 9 },
            { recipeId: recipe._id, dateOfEvent: Date.now(), rating: 8 }
        ]);
        return request(app)
            .get('/api/v1/attempts')
            .then(res => {
                attempts.forEach(attempt => {
                    expect(res.body).toContainEqual(JSON.parse(JSON.stringify(attempt)));
                });
            });
    });

    it('gets a single attempt by id', async() => {
        const attempt = await Attempt.create({
            recipeId: recipe._id,
            dateOfEvent: Date.now(),
            notes: 'crumbs',
            rating: 1
        });
        return request(app)
            .get(`/api/v1/attempts/${attempt._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    recipeId: recipe._id.toString(),
                    dateOfEvent: expect.any(String),
                    notes: 'crumbs',
                    rating: 1,
                    __v: 0
                });
            });
    });

    it('updates an attempt by id', async() => {
        const attempt = await Attempt.create({
            recipeId: recipe._id,
            dateOfEvent: Date.now(),
            notes: 'crumbs',
            rating: 1
        });
        return request(app)
            .patch(`/api/v1/attempts/${attempt._id}`)
            .send({ notes: 'bread' })
            .then(res => {
                expect(res.body).toEqual({
                    _id: attempt._id.toString(),
                    recipeId: recipe._id.toString(),
                    dateOfEvent: expect.any(String),
                    notes: 'bread',
                    rating: 1,
                    __v: 0
                });
            });
    });

    it('deletes attempt by id', async() => {
        const attempt = await Attempt.create({
            recipeId: recipe._id,
            dateOfEvent: Date.now(),
            notes: 'crumbs',
            rating: 1
        });
        return request(app)
            .delete(`/api/v1/attempts/${attempt._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: attempt._id.toString(),
                    recipeId: recipe._id.toString(),
                    dateOfEvent: expect.any(String),
                    notes: 'crumbs',
                    rating: 1,
                    __v: 0
                });
            });
    });


});
