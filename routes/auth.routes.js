const bcrypt = require('bcryptjs');
//const express = require('express');
//const router = express.Router();
const router = require("express").Router();

const saltRounds = 10;

const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut} = require('../middleware/route-guard');

// Signup
router.get('/signup',isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

//  POST Signup page
router.post('/signup',isLoggedOut, async(req, res) =>{
                                                    console.log(req.body)

                                                    const { username,password } = req.body;

                                                    if (!username ||  !password) {
                                                        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
                                                        return;
                                                    }

                                                   const passwordHash =await bcrypt.hash(password, saltRounds) // Generate a hash password  
                                                   User.create({username, password: passwordHash})
                                                   .then(newUser => res.redirect(`/auth/profile/${newUser.username}`))
                                                   //.then(newUser => res.redirect('/auth/profile'))
                                                   .catch(err => console.log(err))

                                                })



// Profile route
router.get("/profile/:username",isLoggedIn, (req, res) => {
    console.log('Session:', req.session);
    
    const { currentUser } = req.session;
    currentUser.loggedIn = true;
    res.render("auth/profile", currentUser)

})
//get login page

router.get('/login',isLoggedOut,(req,res) =>{
    console.log('SESSION =====> ', req.session);
    res.render("auth/login")
    //res.render('/auth/login')
})

 router.post('/login',isLoggedOut,(req,res) => {
                                                    console.log('SESSION =====> ', req.session);
    
                                                const { username,password } = req.body;

                                                    //    Data validation check 
                                                    if (username === '' || password === '') {
                                                        res.render('auth/login', {
                                                        errorMessage: 'Please enter both, username and password to login.'
                                                        });
                                                        return;
                                                    }

                                                User.findOne(username)
                                                .then(user => { 
                                                    console.log('user', user)
                                                  if (!user) { // if user is not found in the DB
                                                    res.render('auth/login', { errorMessage: 'User is not registered. Try with other another User.' });
                                                    return;
                                                  } else if (bcrypt.compareSync(password, user.password)) { 
                                                    const { username, password } = user;
                                                    req.session.currentUser = { username, password }; // creating the property currentUser 
                                                    res.redirect('/auth/profile')
                                                    
                                                  } else { // if password is incorect
                                                    res.render('auth/login', { errorMessage: 'Incorrect password.' });
                                                  }
                                                })
                                                    .catch(error => console.log(error))
})

module.exports = router;