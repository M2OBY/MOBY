const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');
const userSchema = new Schema(
    {
        name: String,
        genre : String,
        prenom :String,
        email : String,
        password : String,
        username :String,
        dateNaissance : String,
        ville : String,
        mobile: String,
        active:Boolean,
        secretToken :String
    }, {
        timestamps : {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

const User = mongoose.model('user',userSchema)
module.exports = User

module.exports.hashPassword = async(password) =>{
    try{
        const salt = await bcrypt.genSalt(10)

        return await bcrypt.hash(password,salt)
    }catch(error){
        throw  new  Error('echec hashing',error)
    }
}

module.exports.comparePasswords = async (inputPassword,hashedPassword) => {
    try{

        console.log('in',inputPassword,' out',hashedPassword)
        if(inputPassword==hashedPassword )return true
       const comparaison = await  bcrypt.compare(inputPassword,hashedPassword)
        console.log('comparaison',comparaison)
        return comparaison
    }catch(error){
        throw new Error('Comparing faild',error)
    }
}