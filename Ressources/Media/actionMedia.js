let fs      = require('fs'),
    path    = require('path');


const office2html = require('office2html')
const  generateHtml = office2html.generateHtml;



module.exports = {

    uploadMedia : async  function (req,res) {


        // ---
        console.info("Upload a file1")

        // --- Catch dans busboy le stream de mes images
        req.pipe(req.busboy)
        try {

            req.busboy.on("file",  function (fieldname, file, filename) {
                console.info("Upload a file3")
                console.info("Uploading: " + filename)

                // --- Create a path to the image
                let fstream =  fs.createWriteStream(path.join(__dirname+'/files', filename.replace(' ', '-')))

                file.pipe(fstream);

                fstream.on('close', function (error) {
                    if (error) {
                        console.log('erruuurfile',error)
                        res.status(400).json(error)

                    } else {
                        // --- Update the object to get the link
                        req.flash('success','Fichier ajouter avec succès')
                        //res.redirect('/media/')
                        console.log('header',req.headers.contentType)
                        res.format ({
                            'application/json': function() {
                                res.send({ sucess: 'Fichier ajouter avec succès' });
                            },'text/html': function() {
                                res.redirect('/media');
                            }
                            });

                    }
                });
            });
        } catch (error) {
            res.status(400).json(error)
        }
    }
}