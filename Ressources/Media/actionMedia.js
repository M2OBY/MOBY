let fs      = require('fs'),
    path    = require('path');

const processMedia = require('./processMedia')
const office2html = require('office2html')
const  generateHtml = office2html.generateHtml;
const pdfreader = require("pdfreader");
const passport = require('passport')



function printRows(rows) {
    Object.keys(rows) // => array of y-positions (type: float)
        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
        .forEach(y => console.log((rows[y] || []).join(" ")));
}

async function  parserMedia (filePath){
    let rows = {}; // indexed by y-position
    let texte=""



    new pdfreader.PdfReader().parseFileItems( filePath, (err,item)=> {

        if (!item || item.page) {
            // end of file, or page
            printRows(rows);
            if(item)  {console.log("PAGE:",item.page) ; texte = texte +"\nPAGE:"+item.page+"\n"}
            rows = {}; // clear rows for next page
        } else if (item.text) {
           // console.log("hhhhhhhhh",item.text)
            // accumulate text items into rows object, per line
            (rows[item.y] = rows[item.y] || []).push(item.text);
            texte = texte + item.text
        }
    });
    console.log("parseMedia",texte)
return texte
}

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
        let texte = await parserMedia("Ressources\\Media\\files\\"+req.body.select2)
        console.log("parsing",texte)
                res.format ({
                    'application/json': function() {
                        res.send({ data: texte });
                    },'text/html': function() {

                        res.render('Parse',{fichierParser:texte});
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
    }
}