//**********Module**********/
//

const Media = require('./modelMedia')

module.exports = {
    //******************************Creer un compte************************************************************ */
    creeMedia: (mediaa) => {
        return new Promise(  (resolve, reject) =>{

            let media =  new Media(mediaa)

            //enregistrer media ds la BDD
            media.save().then((medias) => {
                resolve(medias)
            }, (err) => {
                reject(err)
            })
        })

    }, modifierMedia: (mediaa,nomMedia) => {
        return new Promise(  (resolve, reject) => {


            const filter = {nomRessource: nomMedia};
            const update = {page: mediaa};

// `doc` is the document _before_ `update` was applied
            let doc = Media.findOneAndUpdate(filter, update).then((medias) => {
                if(medias.page!=null) resolve(medias)
            }, (err) => {
                reject(err)
            })

        })

    },
    afficheMedia: (media) => {
        return new Promise( (resolve, reject) =>{

            Media.find(media,(err, result) => {
                if (err) {
                    reject(err)
                } else if(result) {
                    resolve(result)
                }else if(!result) reject (err)
            })
        })},
    rechercheMedia: (media) => {
        return new Promise( (resolve, reject) =>{
            const aggregatorOpts = [{
                $unwind: "$items.page"
            },
                {
                    $group: {
                        _id: "$items.page.numPage",
                        count: { $sum: 1 }
                    }
                }
            ]
            Media.aggregate(aggregatorOpts).exec().then((data)=>{
                console.log("data",data)
                resolve(data)
            })

           /* Media.find(media,(err, result) => {
                if (err) {
                    reject(err)
                } else if(result) {
                    resolve(result)
                }else if(!result) reject (err)
            })*/
        })},
    supprimerMedia : (id) => {
        let name

        Media.remove({_id: id}, (err) => {
            if (err){
                    return err;
                }
        
               return Media;
            })
    },

    afficherMediaName: (id) => {
         return new Promise( (resolve, reject) =>{

            Media.findOne({nomRessource: id},(err, result) => {
                if (err) {
                    reject(err)
                } else if(result) {
                    console.log("ID du fichier", result._id)
                    resolve(result._id)
                }else if(!result) reject (err)
            })
        })} ,
        }

       /*  Media.findById({_id: id}, (err) => {
            if (err){
                    return err;
                }
                console.log("nom fichier", result.nomRessource)
               return Media;
            }) */

