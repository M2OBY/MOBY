const express = require('express')
const router = express.Router()
const actionUser = require ('./actionUser')
const passport = require('passport')

//Autorisation
const isAuthenticated = (req,res,next) => {

    if(req.isAuthenticated()){
        return next()

            }else{
        req.flash('error','il faut senregistrer avant! ')
        res.redirect('/')

}
}

//Autorisation
const isNotAuthenticated = (req,res,next) => {

    if(req.isAuthenticated()){
        req.flash('error','désoler vous êtes déjà connecter')
        res.redirect('/')

    }else{
        return next()

    }
}
router.route('/register')
  .get(isNotAuthenticated,(req, res) => {
    res.render('register');
  })
  .post( (req, res,next)  => {
      actionUser.registerUser(req,res,next);
  });

router.route('/login')
  .get(isNotAuthenticated,(req, res) => {
    res.render('login');
  })
    .post(passport.authenticate('local',{
        successRedirect : 'dashboard',
        failureRedirect : 'login',
        failureFlash : true
    }))


router.route('/dashboard')
    .get(isAuthenticated,(req, res) => {
        console.log('req.user',req.user)


        res.render('dashboard',{username:req.user.username});
    })

router.route('/verify')
    .get(isNotAuthenticated,(req, res) => {
        console.log('req.user',req.user)
        res.render('verify',{token:req.param("token")});
    })
    .post( (req,res,next)=> {
        actionUser.verifyUser(req,res,next);

    });

router.route('/logout')
    .get(isAuthenticated,(req, res) => {
        req.logout()
        req.flash('success', 'déconnection avec succès, à bientôt ! ')

        res.redirect('/')
    })



module.exports = router;