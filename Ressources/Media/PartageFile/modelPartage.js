const mongoose = require('mongoose');
const Schema = mongoose.Schema

const partageSchema = new Schema(
    {
        nomFile :String,
        mailFrom : String,
        mailTo : String

    }, {
        timestamps : {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

const Partage = mongoose.model('partage',partageSchema)
module.exports = Partage