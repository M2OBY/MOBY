const express = require('express')
const router = express.Router()
const actionUser = require ('./actionUser')
const passport = require('passport')


router.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post( (req, res,next)  => {
      actionUser.registerUser(req,res,next);
  });

router.route('/login')
  .get((req, res) => {
    res.render('login');
  })
    .post(passport.authenticate('local',{
        successRedirect : 'dashboard',
        failureRedirect : 'login',
        failureFlash : true
    }))


router.route('/dashboard')
    .get((req, res) => {
        console.log('req.user',req.user)
        res.render('dashboard');
    })




module.exports = router;