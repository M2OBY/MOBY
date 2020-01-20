//********************************************** */
// Ce fichier traite les requetes reçus par routePartage
//Pour les envoyer vers le fichier processPartage
//*********************************************** */

const processPartage = require('./processPartage')
module.exports = {
partageFile : async function(req,res){
    let name = req.body.selectionAffichage
    let mailDest = req.body.email
    let mailExp = req.user.email
    console.log("Nom File :", name,mailDest, mailExp)
     await processPartage.partageFile({nomFile:name,mailTo :mailDest,mailFrom : mailExp})
    .then((result)=>{
        req.flash('success','Fichier partager avec succès')
        res.format ({
            'application/json': function() {
                res.send({sucess :'Fichier partagé'});
            },'text/html': function() {
                res.redirect('/Media/Gestion');
            }
        });



    }).catch((typeErr)=>{
        console.log("erroor",typeErr)
        res.status(400).json(typeErr)
        
    })
    
    }
}