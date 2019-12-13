require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');
const Attempt = require('../lib/models/Attempt');

describe('app routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('creates a recipe', () => {
        return request(app)
            .post('/api/v1/recipes')
            .send({
                name: 'cookies',
                directions: [
                    'preheat oven to 375',
                    'mix ingredients',
                    'put dough on cookie sheet',
                    'bake for 10 minutes'
                ],
                ingredients: [
                    { amount: 3, measurement: 'teaspoons', name: 'sugar' }
                ]
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'cookies',
                    directions: [
                        'preheat oven to 375',
                        'mix ingredients',
                        'put dough on cookie sheet',
                        'bake for 10 minutes'
                    ],
                    ingredients: [
                        { _id: expect.any(String), amount: 3, measurement: 'teaspoons', name: 'sugar' }
                    ],
                    __v: 0
                });
            });
    });

    it('gets all recipes', async() => {
        const recipes = await Recipe.create([
            { name: 'cookies', directions: [] },
            { name: 'cake', directions: [] },
            { name: 'pie', directions: [] }
        ]);

        return request(app)
            .get('/api/v1/recipes')
            .then(res => {
                recipes.forEach(recipe => {
                    expect(res.body).toContainEqual({
                        _id: recipe._id.toString(),
                        name: recipe.name
                    });
                });
            });
    });

    it('gets a single recipe', async() => {
        const recipe = await Recipe.create({
            name: 'chicken soup',
            directions: ['cook it'],
            ingredients: [
                { amount: 3, measurement: 'teaspoons', name: 'sugar' }
            ]
        });
        const attempt = await Attempt.create([
            {
                recipeId: recipe._id,
                dateOfEvent: Date.now(),
                notes: 'doing it',
                rating: 7
            }
        ]);

        return request(app)
            .get(`/api/v1/recipes/${recipe._id}`)
            .then(res => {
                expect(res.body).toMatchObject({
                    _id: recipe._id.toString(),
                    name: recipe.name,
                    directions: JSON.parse(JSON.stringify(recipe.directions)),
                    ingredients: [
                        { _id: expect.any(String), amount: 3, measurement: 'teaspoons', name: 'sugar' }
                    ],
                    attempts: JSON.parse(JSON.stringify(attempt)),
                    __v: 0
                });
            });
    });

    it('updates a recipe by id', async() => {
        const recipe = await Recipe.create({
            name: 'cookies',
            directions: [
                'preheat oven to 375',
                'mix ingredients',
                'put dough on cookie sheet',
                'bake for 10 minutes'
            ],
            ingredients: [
                { amount: 3, measurement: 'teaspoons', name: 'sugar' }
            ]
        });

        return request(app)
            .patch(`/api/v1/recipes/${recipe._id}`)
            .send({ name: 'good cookies' })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'good cookies',
                    directions: [
                        'preheat oven to 375',
                        'mix ingredients',
                        'put dough on cookie sheet',
                        'bake for 10 minutes'
                    ],
                    ingredients: [
                        { _id: expect.any(String), amount: 3, measurement: 'teaspoons', name: 'sugar' }
                    ],
                    __v: 0
                });
            });
    });

    it('should delete a recipe by Id', async() => {
        const recipe = await Recipe.create({
            name: 'cookies',
            directions: ['buy and eat'],
            ingredients: [
                { amount: 3, measurement: 'teaspoons', name: 'sugar' }
            ]
        });

        const attempts = await Attempt.create([
            {
                recipeId: recipe._id,
                dateOfEvent: Date.now(),
                notes: 'doing it',
                rating: 3
            },
            {
                recipeId: recipe._id,
                dateOfEvent: Date.now(),
                notes: 'doing it',
                rating: 7
            },
            {
                recipeId: recipe._id,
                dateOfEvent: Date.now(),
                notes: 'doing it',
                rating: 5
            }
        ]);

        return request(app)
            .delete(`/api/v1/recipes/${recipe._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: recipe._id.toString(),
                    name: 'cookies',
                    directions: JSON.parse(JSON.stringify(recipe.directions)),
                    ingredients: [
                        { _id: expect.any(String), amount: 3, measurement: 'teaspoons', name: 'sugar' }
                    ],
                    __v: recipe.__v
                });
                return Attempt.find();
            })
            .then(attempts => {
                expect(attempts).toHaveLength(0);
            });
    });

    it('should return all events associated with recipe', async() => {
        const recipe = await Recipe.create({
            name: 'cookies',
            directions: ['buy and eat'],
            ingredients: [{
                amount: 3,
                measurement: 'teaspoons',
                name: 'sugar'
            }]
        });
        const attempts = await Attempt.create([{
            recipeId: recipe._id,
            dateOfEvent: Date.now(),
            rating: 3
        }]);

        return request(app)
            .get(`/api/v1/recipes/${recipe._id}`)
            .then(res => {
                expect(res.body).toMatchObject({
                    _id: recipe._id.toString(),
                    name: 'cookies',
                    directions: JSON.parse(JSON.stringify(recipe.directions)),
                    ingredients: [
                        { _id: expect.any(String), amount: 3, measurement: 'teaspoons', name: 'sugar' }
                    ],
                    __v: recipe.__v,
                    attempts: JSON.parse(JSON.stringify(attempts))
                });
            });
    });
});
