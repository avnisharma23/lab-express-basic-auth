const bcrypt = require('bcryptjs');
//const express = require('express');
//const router = express.Router();
const router = require("express").Router();

const saltRounds = 10;

const User = require('../models/User.model');

// Signup
router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res) =>{
    console.log(req.body)

const { username,password } = req.body;

bcrypt.hash(password, saltRounds) // Generate a hash password  
    .then(hash => {
        console.log("Decrypt password",hash);
        return User.create({ username,password: hash}) // // Create a User in the DB, add the Hash password to the new user
    })
    .then(newUser => res.redirect(`/auth/profile/${newUser.username}`))// Redirect the user to their profile
    .catch(err => console.log(err))

})

// Profile route
router.get('/profile/:username', (req, res) => {
    const { username } = req.params;
       
    User.findOne({ username })
        .then(foundUser => res.render('auth/profile', foundUser))
        .catch(err => console.log(err))

    
})


module.exports = router;