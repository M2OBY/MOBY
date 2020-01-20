//********************************************** */
// Ce fichier contient les différentes routes
//pour les services concernant le Media
//*********************************************** */
const express = require('express')
const router = express.Router()
const actionPartage = require ('./actionPartage')


router.route('/partage')
.post( isAuthenticated, (req, res)  => {
    actionPartage.partageFile(req,res);
})