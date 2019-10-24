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
        })}
}