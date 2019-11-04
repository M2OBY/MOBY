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

module.exports = router;