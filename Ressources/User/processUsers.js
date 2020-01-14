//**********Module**********/
//pour controler les inputs du password

const User = require('./modelUser')

//*********************************** */
const Joi    = require('joi')
const bcrypt = require('bcryptjs');
//const User = require('./modelUser')
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring')
const mailer = require('../../misc/mailer')
const mailHTML = require('./mailRegistration')
//const secret = require('../../config/secret').secretKey;
const secret = 'mysecretsshhh';

const userSchema = Joi.object().keys({
    email : Joi.string().email().required(),
    username : Joi.string().required(),
    password : Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirmationPassword : Joi.any().valid(Joi.ref('password')).required()
})
//************************************ */

module.exports = {
    //******************************Creer un compte************************************************************ */
    creerUser: (users) => {
        return new Promise(  (resolve, reject) =>{

                        let user =  new User(users)
                         console.log('processUser',user)
                        //enregistrer le user ds la BDD
                        user.save().then((userss) => {
                            resolve(userss)
                        }, (err) => {
                            reject(err)
                        })
            })

    },
    verifUser: (users) => {
        return new Promise( (resolve, reject) =>{

            User.findOne({
                username: users.username,
                email : users.email
            },(err, result) => {
                if (err) {
                     reject(err)
                } else if(result) {
                        resolve(result)
                    }else if(!result) reject (err)
                })
        })},
    affichageUser: (email) => {
        return new Promise( (resolve, reject) =>{

            User.findOne({
               email : email
            },(err, result) => {
                if (err) {
                    reject(err)
                } else if(result) {
                    resolve(result)
                }else if(!result) reject (err)
            })
        })},

        desactiverCompte : (id) => {

            User.findOneAndUpdate({_id: id}, {active : false}, 
                (err) => {
                if (err){
                        return err;
                    }
            
                   return User;
                })
        },

        updateCompte : (id, body)=> {

            User.findOneAndUpdate({_id : id},
                body,
                  (err) => {
    
               if(err){
    
                  return err;
    
               }
              return User; 
         });
        },

        loginUser(req, res,next){

            return User.findOne({

                email: req.body.email
        
            })
        
                .then(user => {
        
                    if (user) {
        
                        if (bcrypt.compareSync(req.body.password, user.password)) {
        
                            const payload = {
        
                                _id: user._id,
        
                                email: user.email,
        
        
                            }
        
                            let token = jwt.sign(payload, secret, {
        
                                expiresIn: 3600
        
                            });
        
                             return token
        
                        } else {
        
                            return null
        
                        }
        
                    } else {
        
                       return null
        
                    }
        
                });
            
    
             },
}