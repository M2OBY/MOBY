const mongoose = require('mongoose');
const Schema = mongoose.Schema

const mediaSchema = new Schema(
    {
        page: {
            numPage : String,
            MotCle : {

            }
        },
        nomRessource :String,
        userID : String,

    }, {
        timestamps : {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

const Media = mongoose.model('media',mediaSchema)
module.exports = Media