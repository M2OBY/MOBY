const express = require('express')
const router = express.Router()

//pour controler les inputs du password
const Joi    = require('joi')

//Validation user schema
const userSchema = Joi.object().keys({
    email : Joi.string().email().required(),
    username : Joi.string().required(),
    password : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirmationPassword : Joi.any().valid(Joi.ref('password')).required()
})


router.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post((req, res, next)  => {
        console.log('req.body',req.body)
        const result = Joi.validate(req.body,userSchema)
        console.log('result',result)

        if(result.error){
            req.flash('error','Données non valide, essayer une nouvelle fois s\'il vous plait.')
            res.redirect('/users/register')
            return
        }else{
          req.flash('success','Données valide, bravo.')
          res.redirect('/users/register')
          return
      }
  });

router.route('/login')
  .get((req, res) => {
    res.render('login');
  });

module.exports = router;