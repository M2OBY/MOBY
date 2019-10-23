const nodemailer = require('nodemailer')
const config = require('../config/mailer')
const mailgun = require("mailgun-js");

const mg = mailgun({apiKey: config.apiKey, domain: config.domain});




module.exports = {
    sendEmail(from,to,subject,html){
        const data = {
            from: 'Admin MOBY <'+from+'>',
            to: to+', YOU@YOUR_DOMAIN_NAME',
            subject: subject,
            text: html
        };

        return new Promise((resolve,reject) => {
            mg.messages().send(data, function (error, body) {
                console.log(body);
                if(error) reject(error)
                resolve(body)
            })
} )
    }

}