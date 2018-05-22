const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//const passprot = require('passport');

//Load user model
require('../models/User');
const User = mongoose.model('users');

//User Login route
router.get('/login', (request, response) => {
    response.render('users/login');
});

//User register route
router.get('/register', (request, response) => {
    response.render('users/register');
})

router.post('/register', (request, response) => {
    let errors = [];

    if (request.body.password != request.body.confirmpassword) {
        errors.push({
            text: 'Password do not match'
        });
    }

    if (request.body.password.length < 4) {
        errors.push({
            text: 'Password must be at least 4'
        });
    }

    if (errors.length > 0) {
        response.render('users/register', {
            errors: errors,
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            confirmpassword: request.body.confirmpassword
        });
    } else {

        User.findOne({
                email: request.body.email
            })
            .then(user => {
                if (user) {
                    request.flash(
                        'error_msg',
                        'Email already registered'
                    );
                    response.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: request.body.name,
                        email: request.body.email,
                        password: request.body.password
                    });

                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    request.flash('success_msg', 'You are now registered and can log in');
                                    response.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        })
                    });
                }
            });




    }
})

module.exports = router;