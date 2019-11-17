const mongoose = require('mongoose');
const Schema = mongoose.Schema

const mediaSchema = new Schema(
    {
        page: {},
        nomRessource :String,
        userID : String
    }, {
        timestamps : {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

const Media = mongoose.model('media',mediaSchema)
module.exports = Media