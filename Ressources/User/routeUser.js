//********************************************** */
// Ce fichier contient les différentes routes
//pour les services concernant l'utilisateur
//*********************************************** */
const express = require('express')
const router = express.Router()
const actionUser = require ('./actionUser')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const secret = require('../../config/secret').secretKey;




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
        req.flash('error','Désolé vous êtes déjà connecté')
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
      //console.log("YOUPIIIIIIIIIIIIIIIIIIIII")
    res.render('login');
  })
    .post(passport.authenticate('local',{failureRedirect : 'login',failureFlash : true}),(req,res)=>{
        if(req.user){

            const payload = {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            };

            // sign token
            jwt.sign(payload, secret, {expiresIn: 3600}, (err, token) => {
                console.log("token",token)

                res.format ({
                    'application/json': function() {
                        res.send({
                            user: req.user,
                            success: true,
                            secretToken:token });
                    },'text/html': function() {

                        res.redirect('dashboard');
                    }
                });

            });
        }
        
        




    })

router.route('/profil')
    
    .get(isAuthenticated,(req, res) => {
        console.log("YOUPIIIIIIIIIIIIIIIIIIIII",req.user)

      res.render('profil',{data:req.user});
    })

router.route('/dashboard')
    .get(isAuthenticated,(req, res) => {
        
       res.render('dashboard',{username:req.user.username});
    })

router.route('/verify')
    .get(isNotAuthenticated,(req, res) => {
        console.log('req.user',req.user)
        res.render('verify',{token:req.param("token")});
    })
    .post(isNotAuthenticated, (req,res,next)=> {
        actionUser.verifyUser(req,res,next);

    });

router.route('/logout')
    .get(isAuthenticated,(req, res) => {
        req.logout()
        req.flash('success', 'déconnection avec succès, à bientôt ! ')

        res.redirect('/')
    });


    router.route('/desactiver/')
    .post(isAuthenticated,async(req, res) => {


       actionUser.desactiverCompte(req,res)
    });

    router.route('/profil')
    .post(isAuthenticated,async(req, res,next) => {

       actionUser.updateCompte(req,res,next)
    });



module.exports = router;