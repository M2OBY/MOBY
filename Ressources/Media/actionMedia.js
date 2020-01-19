//********************************************** */
// Ce fichier traite les requetes reçus par routeMedia
//Pour les envoyer vers le fichier processMedia
//*********************************************** */

let fs      = require('fs'),
    path    = require('path');
let dataA;
let dataB;
const processMedia = require('./processMedia')
const office2html = require('office2html')
const  generateHtml = office2html.generateHtml;
const pdfreader = require("pdfreader");
const passport = require('passport')

const pdf = require('pdf-parse');

const config = require("../../config/config.js")

function printRows(rows) {
    Object.keys(rows) // => array of y-positions (type: float)
        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
        .forEach(y => console.log((rows[y] || []).join(" ")));
}
//********************************************** */
//Cette fonction permet de parser le fichier PDF Uploder
async function  parserMedia (filePath){
 let rows = {}; // indexed by y-position

    await new pdfreader.PdfReader().parseFileItems( filePath,  (err,item)=> {

        if (!item || item.page) {
            // end of file, or page
            printRows(rows);
            if(item)  {console.log("PAGE:",item.page) ; texte = texte +"\nPAGE:"+item.page+"\n"}
            rows = {}; // clear rows for next page
            console.log("parseMedia",texte)
        } else if (item.text) {
           // console.log("hhhhhhhhh",item.text)
            // accumulate text items into rows object, per line
            (rows[item.y] = rows[item.y] || []).push(item.text);
            texte = texte + item.text
        }
    });
}
let myCallback = function(texte,req,res) {
    let page={numPage : String,
        MotCle : String,
    }
    let pages=[]
    let requette
    let i =0
    let numPage = "/PAGE0/"
    if (texte!=""||!texte){

            console.log("parsing",texte)
        let  words = texte.split(' ');

        for(let x in words){

           // console.log("words[x]",words[x],words[x].length)

            if(words[x].indexOf("PAGE")>0){
                numPage=words[x].substr(words[x].indexOf("PAGE"),6)
               i++
            }else if(words[x].length>5){

                pages.push([numPage,words[x]])
                i++

            }


              requette= processMedia.modifierMedia(pages,req.body.ficheAParser)

        }
        if(requette) {
            res.format({
                'application/json': function () {
                    res.send({data: texte});
                }, 'text/html': function () {

                    res.render('Parse', {fichierParser: texte});
                }
            });
        }else{
            res.format({
                'application/json': function () {
                    res.send({data:"Erreur Serveurs"})
                }, 'text/html': function () {

                    res.render('Parse', {fichierParser: "Erreur Serveurs"});
                }
            });
        }
        }
};
module.exports = {
//************************************************************* */
//Cette fonction permet d'afficher la lites des fichiers uploader
    afficheMedia: async function(req,res){
        await processMedia.afficheMediaP({partage : req.user.email}).then((data)=>{
                 dataB = data
            });
            await processMedia.afficheMediaP({userID : req.user._id}).then((data)=>{
                dataA =data
            });
            console.log("dataaaAfficheMedia",dataB)
            res.format ({
                'application/json': function() {
                    res.send({ data: data });
                },'text/html': function() {
                    let dataF = []
                    console.log("confiiiiig",config.domaine)
                    //for(let x in data) dataF.push(data[x].nomRessource)
                    if(req.path==="/Gestion") res.render('Gestion',{dataA:dataA,dataB:dataB,domain:config.domaine});
                    else res.render('Parse',{data:dataA});
                }
        })


}, 
//******************************************************* */
//Cete fonction permet de chercher une page dans un fichier
recherchePageMedia: async function(req,res){
        await processMedia.rechercheMedia({userID : req.user._id})
            .then((data)=>{
                res.format ({
                    'application/json': function() {
                        res.send({ data: data });
                    },'text/html': function() {
                        let dataF = []

                        for(let x in data) dataF.push(data[x].nomRessource)
                        res.render('Parse',{data:data});
                    }
                });

            },err=>{

            })


    },
//********************************************** */
//Cette fonction permet de parser le fichier PDF Uploder
parseMedia: async function(req,res){
        //let texte = await parserMedia("Ressources\\Media\\files\\"+req.body.select2)
        let rows = {}; // indexed by y-position
        let texte=""
        new pdfreader.PdfReader().parseFileItems("Ressources\\Media\\files\\"+req.body.ficheAParser, function(
            err,
            item
        ) {
            if (!item || item.page) {
                // end of file, or page
                printRows(rows);
                if(item) {console.log("PAGE:", item.page);texte=texte+"\n/PAGE:"+item.page+"/\n"}

                if( !item ){if(!item ){console.log("OPP");myCallback(texte,req,res);return }}
                rows = {}; // clear rows for next page

            } else if (item.text) {
                // accumulate text items into rows object, per line
                (rows[item.y] = rows[item.y] || []).push(item.text);
                texte=texte+" " + item.text
            }
        });

    },
    uploadMedia : async  function (req,res) {

        // ---
        console.info("Upload a file1")

        // --- Catch dans busboy le stream de mes images
        req.pipe(req.busboy)
        try {

            req.busboy.on("file",  function (fieldname, file, filename) {
                console.info("Upload a file3")
                console.info("Uploading: " + filename)

                // --- Create a path
                // Remplacer tous les espaces par des -
                let fstream ;

                let ret= false
                //tester si le même nom du fichier existe
                fs.readFile(filename.replace(' ', '-'), (err, data) => {
                    if (err) ret=true
                    else ret= false
                })

                let newName
                //Si le fichier existe, on enregistre le fichier sous un autre nom en utilisant la date actuelle
                if(ret==false) {   newName = filename.replace('.', Date.now()+'.')
                    fstream=  fs.createWriteStream(path.join(__dirname+'/files',newName))
                }
                //si le fichier n'existe pas on crée le fichier juste en remplacent les espaces
                else {
                      newName = filename.replace(' ','-')
                    fstream=  fs.createWriteStream(path.join(__dirname+'/files',newName ))
                }

                file.pipe(fstream);
                //enregistrement le fichier dans la base de données avec l'ID du user
                processMedia.creeMedia({nomRessource : newName,userID : req.user._id})

                //parserMedia(newName)

                fstream.on('close', function (error) {
                    //si il y a une erreur dans l'upload
                    if (error) {
                        console.log('erruuurfile',error)
                        res.status(402).json(error)
3 
                    } else {
                        // --- Update the object to get the link
                        req.flash('success','Fichier ajouter avec succès')

                        console.log('header',req.headers.contentType)
                        //réponse sous deux format : HTML/Json
                        res.format ({
                            'application/json': function() {
                                res.send({ sucess: 'Fichier ajouter avec succès' });
                            },'text/html': function() {
                                res.redirect('/media');
                            }
                            });

                    }
                });

               // console.log('filepath',path.join(__dirname+'/files',newName))

            });
        } catch (error) {
            res.status(401).json(error)
        }
    },
//************************************************* */
//Cette fonction permet de supprimer un fichier
    supprimerMedia : async function(req,res){
        let name = req.body.selectionDelete
        console.log("Nom File :", name)
        const fileID = await processMedia.afficherMediaName(name)
        .then((result)=>{
            //res.status(200).json({sucess :'Fichier Supprimée'})
            fs.unlinkSync(path.join(__dirname+'/files', name ));
            console.log('file deleted');
            return result
           
        }).catch((typeErr)=>{
            res.status(500).json(typeErr)
        })
        console.log("fileeeeeeeeeeeeeeeeID",fileID)
         // Supprimer le fichier dans la base de données
        await processMedia.supprimerMedia(fileID)
         .then((result)=>{
             //res.status(200).json({sucess :'Fichier Supprimée'})
             req.flash('success','Fichier Supprimé')
               res.format ({
         'application/json': function() {
             res.send({sucess :'Fichier partagé'});
         },'text/html': function() {
             res.redirect('/Media/Gestion');
         }
     });

         }).catch((typeErr)=>{
             res.status(400).json(typeErr)
         })
        
    },
//************************************************** */
//Cette fonction permet de partager un fichier avec un 
//autre utilisateur incsrit
    partageMedia : async function(req,res){
        let name = req.body.selectionAffichage
        let mail = req.body.email
        console.log("Nom File :", name,mail)
        const fileID = await processMedia.partageMedia(name, mail)
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
        
    },

}