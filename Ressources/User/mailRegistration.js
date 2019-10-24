
    module.exports = {
    preparationHTML : (secretToken) =>{
        const html = `Bienvenu ! 
            <br/><br/>
            s'il vous plait, vérifier votre mail en copiant ce token : <br/>
            token : <b> ${secretToken}</b>
            <br/>
            en cliquant sur ce lien : 
            <a href="http://localhost:5000/users/verify?token=${secretToken}">http://localhost:5000/users/verify</a>
            <br/><br/>
            Très bonne journée.
            `

        return html;
    }
    }