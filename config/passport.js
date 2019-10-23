const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../Ressources/User/modelUser')
passport.serializeUser((user,done) =>{

    done(null,user.id)
})

passport.deserializeUser(async (id,done) => {
    try{
        const user = await User.findById(id)
        done(null,user)
    }catch(error){
        done(error,null)
    }
})



passport.use('local',new LocalStrategy({
    usernameField:'email',
    passwordField: 'password',
    passReqToCallback : false
},async (email,password,done)  => {
    try{
        //check if email alrady exist
        const user = await User.findOne( {'email':email})
        if(!user){
            return done(null,false, {message:'User inconnu'})
        }

        //if the password is correct
        const isValid = await User.comparePasswords(password,user.password)
        console.log('isValid',isValid)
        if(!isValid){  return done(null,false, {message: 'mot de passe inconnu'})}
        if(!user.active){
            return done(null,false,{message : 'vous devez vérifier votre mail'})
        }
            return done(null,user)

    }catch (error) {
        return done(error,false)
    }
}))


