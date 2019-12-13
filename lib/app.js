const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/recipes', require('./routes/recipes'));
app.use('/api/v1/attempts', require('./routes/attempts'));

module.exports = app;
