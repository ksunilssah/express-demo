const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Load idea model
require('../models/Idea');
const Idea = mongoose.model('Ideas');



//Idea route
router.get('/', (request, response) => {
    Idea.find({})
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            response.render('ideas/index', {
                ideas: ideas
            })
        })
})


//Add ideas route
router.get('/add', (request, response) => {
    response.render('ideas/add');
});

//Edit ideas route
router.get('/edit/:id', (request, response) => {
    Idea.findOne({
        _id: request.params.id
    }).then(idea => {
        response.render('ideas/edit', {
            idea: idea
        })
    });
});

//Update idea put call
router.put('/:id', (request, response) => {
    Idea.findOne({
        _id: request.params.id
    }).then(idea => {
        idea.title = request.body.title;
        idea.details = request.body.details;
        idea.save()
            .then(idea => {
                response.locals.success_msg = request.flash('success_msg', 'Idea updated successfully');
                response.redirect('/ideas');
            });
    });
});

//Delete idea
router.delete('/:id', (request, response) => {
    Idea.remove({
            _id: request.params.id
        })
        .then(idea => {
            request.flash('error_msg', 'Video idea remvoed');
            response.redirect('/ideas');
        });
});


//Ideas route
router.post('/', (request, response) => {
    const error = [];
    if (!request.body.title) {
        error.push({
            text: 'Please add a title'
        });
    }

    if (!request.body.details) {
        error.push({
            text: 'Please add some details'
        });
    }

    if (error.length > 0) {
        response.render('ideas/add', {
            errors: error,
            title: request.body.title,
            details: request.body.details
        });
    } else {

        const newUser = {
            title: request.body.title,
            details: request.body.details
        }

        new Idea(newUser)
            .save()
            .then(idea => {
                response.locals.success_msg = request.flash('success_msg', 'New idea added');
                response.redirect('/ideas')
            });
    }
})


module.exports = router;