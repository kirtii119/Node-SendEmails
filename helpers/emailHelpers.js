const MailComposer = require('nodemailer/lib/mail-composer');
const tokens = require('../controllers/token.json');
const credentials = require('../credentials.json');
const { google } = require('googleapis');

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(tokens);
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

const getEmail = async()=>{
  try{
  const res = await gmail.users.getProfile({userId:'me'});
  return res.data.emailAddress;
  }
  catch(err){
    console.log(err);
    return "error occured";
}


}


const encodeMessage = (message) => {
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const listThreads = async(query) => { 
    try{
    const threadList = await gmail.users.threads.list(      
        {        
          userId: 'me',        
          q: query,      
        } 
      );  
    return threadList.data.threads;
    }
    catch(err){
        console.log(err);
        return "error occured";
    }
 
  ;}


  const getThreadMessages = async(threadId) => { 
    try{
    const threadItem = await gmail.users.threads.get(      
        {        
         userId: 'me',        
         id : threadId
        } 
      );  
    
      if(!threadItem.data.messages){
        return "error occured";
      }
    return threadItem.data.messages


    }
    catch(err){
        console.log(err);
        return "error occured";
    }
 
}

const modifyLabels = async(messageId) =>{
  try{
    //get all labels
    const getLabels = await gmail.users.labels.list(
      { userId: 'me'}
    )
    
    //Check if AutoGen label exists
    let flag = false
    let labelId;
    getLabels.data.labels.forEach(element => {
      if(element.name == "AutoGen"){
        flag = true
        labelId = element.id
      }
    });

    //create new label if it doesn't exist
    if(flag == false){
      const createLabel = await gmail.users.labels.create(
        {
        userId : 'me',
        name: "AutoGen",
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
        }
      )

      labelId = createLabel.id
    }

    // modify label of the email
    const obj = await gmail.users.messages.modify(
      { userId: 'me',        
        id : messageId,
        addLabelIds: labelId}
    )

    if(!obj){
      return "error occured";
    }
  }
  catch(err){
    console.log(err);
    return "error occured";
}
}

const sendMail = async(options, threadId) =>{
    try{
  const rawMessage = await createMail(options);
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: rawMessage,
      threadId: threadId
    },
  });
  if(!id){
  return 0;
}
    return id;
}
catch(err){
    console.log(err);
    return "error occured";
}
}

module.exports = {createMail, sendMail, listThreads, getThreadMessages, getEmail, modifyLabels};
