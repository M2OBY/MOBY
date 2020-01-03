const express = require('express')
const router = express.Router()
const actionMedia = require ('./actionMedia')

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



router.route('/')
    .get(isAuthenticated,(req, res) => {
        console.log('req.user',req.user)
        res.render('uploadFile',{username:req.user.username});
    })
    .post( isAuthenticated, (req, res)  => {
        actionMedia.uploadMedia(req,res);
    })
router.route('/parse/')
    .post(isAuthenticated,(req, res) => {

        actionMedia.parseMedia(req,res)
    })

    .get(isAuthenticated,async (req, res) => {

         actionMedia.afficheMedia(req,res)

           // res.render('Parse',{data:data})

       // res.render('Parse',{username:req.user.username});
    })
router.route('/find/')
    .post(isAuthenticated,(req, res) => {

        actionMedia.parseMedia(req,res)
    })

    .get(isAuthenticated,async (req, res) => {

        actionMedia.recherchePageMedia(req,res)

        // res.render('Parse',{data:data})

        // res.render('Parse',{username:req.user.username});
    })

module.exports = router;