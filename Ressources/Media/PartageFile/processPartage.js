//********************************************** */
// Ce fichier permet d'envoyer les requetes à
//la base de données Mongo DB
//*********************************************** */
//**********Module**********/
const Partage = require('./modelPartage');

module.exports = {
    //******************************Partage un fichier************************************************************ */
    partageFile: (partageInfos) => {
        return new Promise(  (resolve, reject) =>{

            let partageInfo =  new Partage(partageInfos)

            //enregistrer media ds la BDD
            partageInfo.save().then((data) => {
                resolve(data)
            }, (err) => {
                reject(err)
            })
        })

    }, afficheFileP : (user) => {
        
        return new Promise( (resolve, reject) =>{

            Partage.find(user,(err, result) => {
                if (err) {
                    reject(err)
                } else if(result) {
                    resolve(result)
                }else if(!result) reject (err)
            })
        })}

    

}