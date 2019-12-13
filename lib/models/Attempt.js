const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe'
    },
    dateOfEvent: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    }
});

schema.virtual('day')
    .get(function(){
        return this.dateOfEvent.getDate();
    })
    .set(function(day){
        return this.dateOfEvent.setDate(day);
    });

schema.virtual('month')
    .get(function() {
        return this.dateOfEvent.getMonth();
    })
    .set(function(month){
        return this.dateOfEvent.setMonth(month);
    });

schema.virtual('year')
    .get(function() {
        return this.dateOfEvent.getFullYear();
    })
    .set(function(year){
        return this.dateOfEvent.setFullYear(year);
    });

module.exports = mongoose.model('Attempt', schema);
