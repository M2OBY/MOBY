const express = require('express')
const router = express.Router()
const actionUser = require ('./actionUser')
const passport = require('passport')
<<<<<<< HEAD
const withAuth = require('../../config/middleware').default;
const jwt = require('jsonwebtoken');
const User = require('./modelUser')
const cors = require ("cors")
=======
const jwt = require('jsonwebtoken');
const secret = require('../../config/secret').secretKey;
>>>>>>> 5aa76873b0bdb43094e7f1bf14293292482f7aac

router.use(cors());
//Autorisation
 function isAuthenticated(req,res,next) {

    if(req.isAuthenticated()){
        return next()

            }else{
        req.flash('error','il faut senregistrer avant! ')
        res.redirect('/')

}
}

//Autorisation
//const isNotAuthenticated = (req,res,next) => {
function isNotAuthenticated (req,res,next){
    if(req.isAuthenticated()){
        req.flash('error','désolé vous êtes déjà connecté')
        res.redirect('/')

    }else{
        return next()

    }
}
/*
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
    .post(passport.authenticate('local'),(req,res)=>{
<<<<<<< HEAD
        console.log("reqLogin",req.user)
        console.log("Connexion: ", req.isAuthenticated())
        req.session.save()
        res.format ({
            'application/json': function() {
                res.send({ user: req.user });
            },'text/html': function() {

                res.redirect('dashboard');
            }
        });
=======
        if(req.user){

            const payload = {
                id: req.user.id,
                name: req.user.name,

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
        console.log("reqLogin",req.user,"auten:",req.isAuthenticated())


>>>>>>> 5aa76873b0bdb43094e7f1bf14293292482f7aac

    })

router.route('/profil')
    .post((req, res,next) => {
        console.log("profil requette connecté : ",req.isAuthenticated())
        actionUser.affichageProfil(req,res,next);
    })
 

router.route('/dashboard')
    .get(isAuthenticated,(req, res) => {
        console.log('req..userrrrr',req)
        console.log('connexion dasboard',req.isAuthenticated())
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
    });

    router.route('/desactiver/:userID')
    .put(isAuthenticated,async(req, res) => {

       actionUser.desactiverCompte(req,res)
    });

    router.route('/Profil/:userID')
    .put(isAuthenticated,async(req, res) => {
        console.log('req..Profilll',req)
       actionUser.updateCompte(req,res)
    }); */
/*
    //TEST Pour login

    router.route('/login')
    .post((req, res) => {
        const { email, password } = req.body;
        User.findOne({ email }, function(err, user) {
          if (err) {
            console.error(err);
            res.status(500)
              .json({
              error: 'Internal error please try again'
            });
          } else if (!user) {
            res.status(401)
              .json({
              error: 'Incorrect email or password'
            });
          } else {
            user.isCorrectPassword(password, function(err, same) {
              if (err) {
                res.status(500)
                  .json({
                  error: 'Internal error please try again'
                });
              } else if (!same) {
                res.status(401)
                  .json({
                  error: 'Incorrect email or password'
                });
              } else {
                // Issue token
                console.log("Client connectéeeee!!!!!!!!!")
                const payload = { email };
                const token = jwt.sign(payload, secret, {
                  expiresIn: '1h'
                });
                res.cookie('token', token, { httpOnly: true }).sendStatus(200);
              }
            });
          }
        });
      });

*/
/*
    router.route('/login')
    .post((req, res,next) => {
        console.log("profil requette connecté : ",req.isAuthenticated())
        actionUser.loginUser(req,res,next);
    })
    */
    router.post('/login', actionUser.loginUser);

router.route('/profil')
    .post((req, res,next) => {
        //console.log("profil requette connecté : ",req.isAuthenticated())
        actionUser.affichageProfil(req,res,next);
    })

    router.route('/login')
    .get((req, res) => {
        //console.log("YOUPIIIIIIIIIIIIIIIIIIIII")
      res.render('login');
    })

    router.route('/profil')
    .post((req, res,next) => {
        console.log("profil requette connecté : ",req.isAuthenticated())
        actionUser.affichageProfil(req,res,next);
    })
 

router.route('/dashboard')
    .get(isAuthenticated,(req, res) => {
        console.log('req..userrrrr',req)
        console.log('connexion dasboard',req.isAuthenticated())
       res.render('dashboard',{username:req.user.username});
    })

module.exports = router;