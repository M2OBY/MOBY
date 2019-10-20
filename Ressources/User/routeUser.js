const express = require('express')
const router = express.Router()
const actionUser = require ('./actionUser')



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





module.exports = router;