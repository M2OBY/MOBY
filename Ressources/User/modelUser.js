const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const userSchema = new Schema(
    {
        nom: String,
        prenom :String,
        email : String,
        password : String,
        dateNaissance : String,
        adresse1 : String,
        adresse2 : String,
        codePostale : String,
        ville : String,
        mobile: String,
        fixe:String,
        active:Boolean
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
       return await  bcrypt.compare(inputPassword,hashedPassword)

    }catch(error){
        throw new Error('Comparing faild',error)
    }
}