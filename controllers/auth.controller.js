const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const credentials = require('../credentials.json');

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.labels', 'https://www.googleapis.com/auth/gmail.modify' ];

const authGenerateURLController = async(req, res)=>{
try{

const url = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: GMAIL_SCOPES,
});

res.redirect(url);
}
catch(err){
    res.set(500).send(err) 
    //normally, send customised error messages + log errors
}
}

const authCodeController = async(req, res)=>{
  try{

      if(req.query.code)
      {
      const code = req.query.code;
      oAuth2Client.getToken(code).then(({ tokens }) => {
        const tokenPath = path.join(__dirname, 'token.json');
        fs.writeFileSync(tokenPath, JSON.stringify(tokens));
        console.log('Tokens stored to token.json');
      });

      res.set(201).send('Token created')
      }

      else
      {
        res.set(500).send("Could not log in")
      }
  }
  catch(err){
    res.set(500).send(err)
  }

}



module.exports = {authGenerateURLController, authCodeController }