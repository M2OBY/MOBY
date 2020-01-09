const express = require('express')
const router = express.Router()
const actionMedia = require ('./actionMedia')
let fs      = require('fs'),
    path    = require('path'),
    async   = require('async');

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


    router.route('/supprimer/')
    router.route('/supprimer/:mediaID')
    .delete(isAuthenticated,async(req, res) => {

        actionMedia.supprimerMedia(req,res)
    })

// -- LIRE UN REPERTOIRE
     router.route('/files')
         .get( function (req, res) {
    let myDir = [];
    fs.readdir(path.join(__dirname+'/files'),(err, result)=>{
        async.each(result,(file, callback) => {
            // --
            fs.stat(path.join(__dirname+'/files',file), (err, stat) => {
                if(stat.isFile()){
                    myDir.push('http://0.0.0.0:5000/media/files/'+file+'');
                }
                callback()
            })
        },(err)=>{
            res.status(200).json({repo : myDir})
        })
    })
})
// -- Read File
router.route('/files/:path')
    .get( function (req, res) {
        console.log("filesPath")
    res.sendFile(path.join(__dirname+'/files',req.params.path))
});


module.exports = router;