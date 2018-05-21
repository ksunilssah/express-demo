const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


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
        response.send('Passed');
    }
})

module.exports = router;