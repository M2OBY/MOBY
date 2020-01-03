
    module.exports = {
    preparationHTML : (secretToken) =>{
        const html = `Bienvenu ! 
            <br/><br/>
            s'il vous plait, vérifier votre mail en copiant ce token : <br/>
            token : <b> ${secretToken}</b>
            <br/>
            en cliquant sur ce lien : 
            <a href="http://localhost:3000/verif">http://localhost:3000/verif</a>
            <br/><br/>
            Très bonne journée.
            `

        return html;
    }
    }