//********************************************** */
// Ce fichier permet d'envoyer les requetes à
//la base de données Mongo DB
//*********************************************** */



//**********Module**********/
//pour controler les inputs du password

const User = require('./modelUser')

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
//************************************************* */
//Cette fonction de vérifier le mail de l'utilisateur
    verifUser: (users) => {
        return new Promise( (resolve, reject) =>{

            User.findOne({
                
                email : users.email
            },(err, result) => {
                if (err) {
                     reject(err)
                } else if(result) {
                        resolve(result)
                    }else if(!result) reject (err)
                })
        })},
//************************************************* */
//Cette fonction d'afficher les infos de l'utilisateur
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
//************************************************* */
//Requetes NO Sql pour désactiver le compte
        desactiverCompte : (id) => {
        return new Promise( (resolve, reject) =>{
            User.findOneAndUpdate({_id: id}, {active : false}, 
                (err, result) => {
                if (err){
                        reject (err);
                    }
            
                   resolve (result);
            }) 
        })
    },
//************************************************* */
//Requetes NO Sql pour mettre à jour le compte
        updateCompte : (id, body)=> {

    return new Promise( (resolve, reject) =>{

        User.findOneAndUpdate({
            _id : id
        },body,(err, result) => {
            if (err) {
                reject(err)
            } else if(result) {
                resolve(result)
            }else if(!result) reject (err)
        })
    })}


}