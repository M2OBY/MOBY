let fs      = require('fs'),
    path    = require('path');

const processMedia = require('./processMedia')
const office2html = require('office2html')
const  generateHtml = office2html.generateHtml;
const pdfreader = require("pdfreader");
const passport = require('passport')

const pdf = require('pdf-parse');



function printRows(rows) {
    Object.keys(rows) // => array of y-positions (type: float)
        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
        .forEach(y => console.log((rows[y] || []).join(" ")));
}

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
/*
    let texte=""
    let dataBuffer = fs.readFileSync(filePath);

    pdf(dataBuffer).then(function(data) {

        // number of pages
        console.log(data.numpages);
        // number of rendered pages
        console.log(data.numrender);
        // PDF info
        console.log(data.info);
        // PDF metadata
        console.log(data.metadata);
        // PDF.js version
        // check https://mozilla.github.io/pdf.js/getting_started/
        console.log(data.version);
        // PDF text
        console.log(data.text);
        let texte=data.text
        return texte
    });
*/
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


              requette= processMedia.modifierMedia(pages,req.body.select2)

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

    afficheMedia: async function(req,res){
            await processMedia.afficheMedia({userID : req.user._id})
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

            })


    },
    parseMedia: async function(req,res){
        //let texte = await parserMedia("Ressources\\Media\\files\\"+req.body.select2)
        let rows = {}; // indexed by y-position
        let texte=""
        new pdfreader.PdfReader().parseFileItems("Ressources\\Media\\files\\"+req.body.select2, function(
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


    /*    let dataBuffer = fs.readFileSync("Ressources\\Media\\files\\"+req.body.select2);

        pdf(dataBuffer).then(function(data) {

            // number of pages
            console.log(data.numpages);
            // number of rendered pages
            console.log(data.numrender);
            // PDF info
            console.log(data.info);
            // PDF metadata
            console.log(data.metadata);
            // PDF.js version
            // check https://mozilla.github.io/pdf.js/getting_started/
            console.log(data.version);
            // PDF text
            console.log(data.text);
             texte=data.text
            console.log("parsing",texte)
            res.format ({
                'application/json': function() {
                    res.send({ data: texte });
                },'text/html': function() {

                    res.render('Parse',{fichierParser:texte});
                }
            });

        });*/

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
                        res.status(400).json(error)

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
            res.status(400).json(error)
        }
    },

    supprimerMedia : async function(req,res){
        let mediaID = req.params.mediaID
        const resultat = await processMedia.afficherMediaName(mediaID)
        console.log("Nom File :", resultat)
        //Voir pour mettre une condition de test avant la suppression
        fs.unlinkSync(path.join(__dirname+'/files', resultat ));
        console.log('file deleted');
        // Supprimer le fichier dans la base de données
        processMedia.supprimerMedia(mediaID);
        res.json({message: 'Fichier Supprimée'})
        
    }
}