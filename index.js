'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('excuses.json')
const db = low(adapter)

var fs = require('fs');


const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('Webhook is listening'));
// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  
  // Parse the request body from the POST
  let body = req.body;
  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
        if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
        }
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});
// Accepts GET requests at the /webhook endpoint

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "youfindexcuse";
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});
//Testing the incrementation or the note
app.get('/monjson', (req,res) => {
  let result = db.get('intercours').find({ id: 4 }).update('note', n => n + 1).value();
  db.write();
  var change = result.text;
  res.send(result);
})
//Import the JSON file on the /excuse url
app.get('/excuses', (req,res) => {
  let excuses = db.value();
  res.send(excuses);
})

//handleMessage is when is not like a "reply", it's more a classic message
function handleMessage(sender_psid, received_message) {
let response;
    response = {
      "text": `Salut ! Je m'appelle Bob 👼 je suis un bot 🤖, je peux te trouver une excuse pour tes retards et absences en cours 🕧 ! On commence à te chercher une excuse ?? 🕵‍♂`
    }
    callSendAPI(sender_psid, response);
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Une excuse ? ",
            "buttons": [
              {
                "type": "postback",
                "title": "oui 👍",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "non 😕",
                "payload": "no",

              }
            ],
          }]
        }
      }
    }
  // Send the response message
  callSendAPI(sender_psid, response);
}
// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  //We declare each value
  // Get the payload for the postback
  let payload = received_postback.payload;
  let degreOfTeacherHumor = received_postback.degreOfTeacherHumor;
  let response;
  let absence;
  let intercours;
  let bus;
  let velo;
  let train;
  let marche;
  //Degree of humor
  var humor;
  console.log("Le paylod vaut : " + payload)
  //I call the excuse API
  
      var importedJSON = JSON.parse(fs.readFileSync('excuses.json', 'utf8'));
      console.log(importedJSON);
      if (payload==='yes') {    
        response = {
        "text": `Cool ! On va essayer de savoir ce qu'il te faut ! Tu es absent ou en retard ? 😜`
        }
        // Send the response message
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Absent ou en retard ? ",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Absent ❌",
                    "payload": "absence",
                  },
                  {
                    "type": "postback",
                    "title": "En retard ⏰",
                    "payload": "retard",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='no' ) {
        response = {
        "text": `Quelle est la raison de ton message ? 🤔`
        }
        // Send the response message
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Objet de message",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Contact ou autre 😊",
                    "payload": "contact",
                  },
                  {
                    "type": "postback",
                    "title": "Proposer une excuse !👌",
                    "payload": "proposer",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='contact' ) {
        response = {
        "text": `Pour toute question, merci de nous contacter à l'adresse : trouvetonexcuse@gmail.com 📧`
        }
      }
      else if (payload==='proposer' ) {
        response = {
        "text": `Tu peux y aller on t'écoute ! 🙌`
        }
        callSendAPI(sender_psid, response);
        response = {
        "text": `Une fois envoyée, l'équipe de Trouve Ton Excuse va l'étudier dans les plus brefs délais ! Merci ! 😍`
        }
      }
      else if (payload==='absence' ) {
        response = {
        "text": `Quel est le caractère de ton/ta prof ? 😤`
        }
        // Send the response message
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Caractère de ton/ta prof",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Strict 👮",
                    "payload": "absencebest1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "absencebest2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "absencebest3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='absence1'||payload==='absence2'||payload==='absence3'||payload==='absencebest1'||payload==='absencebest2'||payload==='absencebest3') {    
        // Create the payload for a basic text message
        humor = (payload==='absence1'||payload==='absencebest1') ? 1 : ((payload==='absence2'||payload==='absencebest2')? 2 : 3);
        console.log("humor var : " + humor)
        //If it's not the first time
        if(payload==='absence1'||payload==='absence2'||payload==='absence3'){
          do {
            absence = importedJSON.absence[Math.floor((Math.random() * importedJSON.absence.length))]; 
          } while (absence.humor !== humor);
          response = {
            "text": `Une autre excuse : ${absence.text}`
          }
        }
        //If we want the best excuse
        else {
          var absenceLenght=importedJSON.absence.length;
          var bestabsencevalue=0;
          var bestabsenceid=0;
          for(var i=0;i<absenceLenght; i++){
            if(bestabsencevalue<importedJSON.absence[i].note && importedJSON.absence[i].humor === humor){
              bestabsencevalue=importedJSON.absence[i].note;
              bestabsenceid=importedJSON.absence[i].id;
              console.log("We just find a better value");
            }
            else;
          }
          absence = importedJSON.absence[bestabsenceid];
          response = {
            "text": `La meilleur excuse est : ${absence.text}`
          }
        }

        callSendAPI(sender_psid, response);
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Es-tu satisfait ? ",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Oui merci !👌",
                    "payload": `exitabsence${absence.id}`,
                  },
                  {
                    "type": "postback",
                    "title": "Non, une autre ! 😀",
                    "payload": `absence${humor}`,
                  },
                  {
                    "type": "postback",
                    "title": "Recommencer 🔙",
                    "payload": "yes",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='retard' ) {    
        response = {
        "text": `Es-tu en intercours ou sors-tu du transport ?`
        }
        callSendAPI(sender_psid, response);
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Intercours ou transport ?",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Intercours 🔴",
                    "payload": "intercours",
                  },
                  {
                    "type": "postback",
                    "title": "Transport 🚌",
                    "payload": "transport1",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='intercours'){
        response = {
        "text": `Quel est le caractère de ton/ta prof ?`
        }
        // Send the response message
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Caractère de ton/ta prof",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Strict 👮",
                    "payload": "intercoursbest1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "intercoursbest2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "intercoursbest3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='intercours1'||payload==='intercours2'||payload==='intercours3'||payload==='intercoursbest1'||payload==='intercoursbest2'||payload==='intercoursbest3') {    
        // Create the payload for a basic text message
        humor = (payload==='intercours1'||payload==='intercoursbest1') ? 1 : ((payload==='intercours2'||payload==='intercoursbest2')? 2 : 3);
        console.log("humor var : " + humor)
        //If it's not the first time
        if(payload==='intercours1'||payload==='intercours2'||payload==='intercours3'){
          do {
            intercours = importedJSON.intercours[Math.floor((Math.random() * importedJSON.intercours.length))]; 
          } while (intercours.humor !== humor);
          response = {
            "text": `Une autre excuse : ${intercours.text}`
          }
        }
        //If we want the best excuse
        else {
          var intercoursLenght=importedJSON.intercours.length;
          var bestintercoursvalue=0;
          var bestintercoursid=0;
          for(var i=0;i<intercoursLenght; i++){
            if(bestintercoursvalue<importedJSON.intercours[i].note && importedJSON.intercours[i].humor === humor){
              bestintercoursvalue=importedJSON.intercours[i].note;
              bestintercoursid=importedJSON.intercours[i].id;
              console.log("We just find a better value");
            }
            else;
          }
          intercours = importedJSON.intercours[bestintercoursid];
          response = {
            "text": `La meilleur excuse est : ${intercours.text}`
          }
        }


      //TWe send the excuse
        callSendAPI(sender_psid, response);

        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Es-tu satisfait ? ",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Oui merci !",
                    "payload": `exitintercours${intercours.id}`,
                  },
                  {
                    "type": "postback",
                    "title": "Non, une autre !",
                    "payload": `intercours${humor}`,
                  },
                  {
                    "type": "postback",
                    "title": "Recommencer",
                    "payload": "yes",
                  }
                ],
              }]
            }
          }
        }
      }

      else if (payload==='transport1' ) {  
        response = {
        "text": `Comment viens-tu à l'école?`
        }
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Ton mode de transport ?",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "En marchant",
                    "payload": "marche",
                  },
                  {
                    "type": "postback",
                    "title": "Autre(bus,train..)",
                    "payload": "transport2",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='transport2' ) {  
        response = {
        "text": `Quel est ton mode de transport ?`
        }
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Ton mode de transport ?",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Bus",
                    "payload": "bus",
                  },
                  {
                    "type": "postback",
                    "title": "Vélo",
                    "payload": "velo",
                  },
                  {
                    "type": "postback",
                    "title": "Train",
                    "payload": "train",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='bus' ) {  
        response = {
        "text": `Quel est le caractère de ton/ta prof ?`
        }
        // Send the response message
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Caractère de ton/ta prof",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Strict 👮",
                    "payload": "bus1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "bus2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "bus3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='bus1'||payload==='bus2'||payload==='bus3'||payload==='busbest1'||payload==='busbest2'||payload==='busbest3') {    
        // Create the payload for a basic text message
        humor = (payload==='bus1'||payload==='busbest1') ? 1 : ((payload==='bus2'||payload==='busbest2')? 2 : 3);
        console.log("humor var : " + humor)
        //If it's not the first time
        if(payload==='bus1'||payload==='bus2'||payload==='bus3'){
          do {
            bus = importedJSON.bus[Math.floor((Math.random() * importedJSON.bus.length))]; 
          } while (bus.humor !== humor);
          response = {
            "text": `Une autre excuse : ${bus.text}`
          }
        }
        //If we want the best excuse
        else {
          var busLenght=importedJSON.bus.length;
          var bestibusvalue=0;
          var bestbusid=0;
          for(var i=0;i<busLenght; i++){
            if(bestbusvalue<importedJSON.bus[i].note && importedJSON.bus[i].humor === humor){
              bestbusvalue=importedJSON.bus[i].note;
              bestbusid=importedJSON.bus[i].id;
              console.log("We just find a better value");
            }
            else;
          }
          bus = importedJSON.bus[bestbusid];
          response = {
            "text": `La meilleur excuse est : ${bus.text}`
          }
        }

        callSendAPI(sender_psid, response);
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Es-tu satisfait ? ",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Oui merci !",
                    "payload": `exitbus${bus.id}`,
                  },
                  {
                    "type": "postback",
                    "title": "Non, une autre !",
                    "payload": `bus${humor}`,
                  },
                  {
                    "type": "postback",
                    "title": "Recommencer",
                    "payload": "yes",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='train' ) {  
        response = {
        "text": `Quel est le caractère de ton/ta prof ?`
        }
        // Send the response message
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Caractère de ton/ta prof",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Strict 👮",
                    "payload": "trainbest1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "trainbest2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "trainbest3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='train1'||payload==='train2'||payload==='train3'||payload==='trainbest1'||payload==='trainbest2'||payload==='trainbest3') {    
        // Create the payload for a basic text message
        humor = (payload==='train1'||payload==='trainbest1') ? 1 : ((payload==='train2'||payload==='trainbest2')? 2 : 3);
        console.log("humor var : " + humor)
        //If it's not the first time
        if(payload==='train1'||payload==='train2'||payload==='train3'){
          do {
            train = importedJSON.train[Math.floor((Math.random() * importedJSON.train.length))]; 
          } while (train.humor !== humor);
          response = {
            "text": `Une autre excuse : ${train.text}`
          }
        }
        //If we want the best excuse
        else {
          var trainLenght=importedJSON.train.length;
          var besttrainvalue=0;
          var besttrainid=0;
          for(var i=0;i<trainLenght; i++){
            if(besttrainvalue<importedJSON.train[i].note && importedJSON.train[i].humor === humor){
              besttrainvalue=importedJSON.train[i].note;
              besttrainid=importedJSON.train[i].id;
              console.log("We just find a better value");
            }
            else;
          }
          train = importedJSON.train[besttrainid];
          response = {
            "text": `La meilleur excuse est : ${train.text}`
          }
        }

      //We send the excuse
        callSendAPI(sender_psid, response);
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Es-tu satisfait ? ",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Oui merci !",
                    "payload": `exittrain${train.id}`,
                  },
                  {
                    "type": "postback",
                    "title": "Non, une autre !",
                    "payload": `train${humor}`,
                  },
                  {
                    "type": "postback",
                    "title": "Recommencer",
                    "payload": "yes",
                  }
                ],
              }]
            }
          }
        }
      }

      else if (payload==='marche' ) {  
        response = {
        "text": `Quel est le caractère de ton/ta prof ?`
        }
        // Send the response message
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Caractère de ton/ta prof",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Strict 👮",
                    "payload": "marchebest1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "marchebest2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "marchebest3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='marche1'||payload==='marche2'||payload==='marche3'||payload==='marchebest1'||payload==='marchebest2'||payload==='marchebest3') {    
        // Create the payload for a basic text message
        humor = (payload==='marche1'||payload==='marchebest1') ? 1 : ((payload==='marche2'||payload==='imarchebest2')? 2 : 3);
        console.log("humor var : " + humor)
        //If it's not the first time
        if(payload==='marche1'||payload==='marche2'||payload==='marche3'){
          do {
            marche = importedJSON.marche[Math.floor((Math.random() * importedJSON.marche.length))]; 
          } while (marche.humor !== humor);
          response = {
            "text": `Une autre excuse : ${marche.text}`
          }
        }
        //If we want the best excuse
        else {
          var marcheLenght=importedJSON.marche.length;
          var bestmarchevalue=0;
          var bestmarcheid=0;
          for(var i=0;i<marcheLenght; i++){
            if(bestmarchevalue<importedJSON.marche[i].note && importedJSON.marche[i].humor === humor){
              bestmarchevalue=importedJSON.marche[i].note;
              bestmarcheid=importedJSON.marche[i].id;
              console.log("We just find a better value");
            }
            else;
          }
          marche = importedJSON.marche[bestmarcheid];
          response = {
            "text": `La meilleur excuse est : ${marche.text}`
          }
        }
        callSendAPI(sender_psid, response);
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Es-tu satisfait ? ",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Oui merci !",
                    "payload": `exitmarche${marche.id}`,
                  },
                  {
                    "type": "postback",
                    "title": "Non, une autre !",
                    "payload": `marche${humor}`,
                  },
                  {
                    "type": "postback",
                    "title": "Recommencer",
                    "payload": "yes",
                  }
                ],
              }]
            }
          }
        }
      }

      else if (payload==='velo' ) {  
        response = {
        "text": `Quel est le caractère de ton/ta prof ?`
        }
        // Send the response message
        callSendAPI(sender_psid, response);
        // Ask if the user is late or not
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Caractère de ton/ta prof",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Strict 👮",
                    "payload": "velobest1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "velobest2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "velobest3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='velo1'||payload==='velo2'||payload==='velo3'||payload==='velobest1'||payload==='velobest2'||payload==='velobest3') {    
        // Create the payload for a basic text message
        humor = (payload==='velo1'||payload==='velobest1') ? 1 : ((payload==='velo2'||payload==='velobest2')? 2 : 3);
        console.log("humor var : " + humor)
        //If it's not the first time
        if(payload==='velo1'||payload==='velo2'||payload==='velo3'){
          do {
            velo = importedJSON.velo[Math.floor((Math.random() * importedJSON.velo.length))]; 
          } while (velo.humor !== humor);
          response = {
            "text": `Une autre excuse : ${velo.text}`
          }
        }
        //If we want the best excuse
        else {
          var veloLenght=importedJSON.velo.length;
          var bestvelovalue=0;
          var bestveloid=0;
          for(var i=0;i<veloLenght; i++){
            if(bestvelovalue<importedJSON.velo[i].note && importedJSON.velo[i].humor === humor){
              bestvelovalue=importedJSON.velo[i].note;
              bestveloid=importedJSON.velo[i].id;
              console.log("We just find a better value");
            }
            else;
          }
          velo = importedJSON.velo[bestveloid];
          response = {
            "text": `La meilleur excuse est : ${velo.text}`
          }
        }

        callSendAPI(sender_psid, response);
        response = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "Es-tu satisfait ? ",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Oui merci !",
                    "payload": `exitvelo${velo.id}`,
                  },
                  {
                    "type": "postback",
                    "title": "Non, une autre !",
                    "payload": `velo${humor}`,
                  },
                  {
                    "type": "postback",
                    "title": "Recommencer",
                    "payload": "yes",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='exit' ) {
        response = {"text": `Merci ! A bientôt ! ✌ `}
        callSendAPI(sender_psid, response);
        response = {"text": `Viens faire un tour sur notre site --> http://urlz.fr/75R3 👈`}
        callSendAPI(sender_psid, response);
        response = {"text": `Télécharge notre application sous android --> http://urlz.fr/75R4 👈`}
        console.log('Sending the simple exit message'); 
      }  
      //In case the user is satisfait with this excuse, we add +1 to the note
      else {
        var intercoursLenght=importedJSON.intercours.length;
        var absenceLenght=importedJSON.absence.length;
        var busLenght=importedJSON.bus.length;
        var veloLenght=importedJSON.velo.length;
        var trainLenght=importedJSON.train.length;
        var marcheLenght=importedJSON.marche.length;

        for(var i=0;i<intercoursLenght; i++){
          if (payload === `exitintercours${i}`){
            let result = db.get('intercours').find({ id: i }).update('note', n => n + 1).value();
            db.write();
            console.log(`Writing into ${payload}`);
          }
          else;
        }
        i=0;
        for(var i=0;i<absenceLenght; i++){
          if (payload === `exitabsence${i}`){
            let result = db.get('absence').find({ id: i }).update('note', n => n + 1).value();
            db.write();
            console.log(`Writing into ${payload}`);
          }
          else;
        }
        i=0;
        for(var i=0;i<busLenght; i++){
          if (payload === `exitbus${i}`){
            let result = db.get('bus').find({ id: i }).update('note', n => n + 1).value();
            db.write();
            console.log(`Writing into ${payload}`);
          }
          else;
        }
        i=0;
        for(var i=0;i<veloLenght; i++){
          if (payload === `exitvelo${i}`){
            let result = db.get('velo').find({ id: i }).update('note', n => n + 1).value();
            db.write();
            console.log(`Writing into ${payload}`);
          }
          else;
        }
        i=0;
        for(var i=0;i<trainLenght; i++){
          if (payload === `exittrain${i}`){
            let result = db.get('train').find({ id: i }).update('note', n => n + 1).value();
            db.write();
            console.log(`Writing into ${payload}`);
          }
          else;
        }
        i=0;
        for(var i=0;i<marcheLenght; i++){
          if (payload === `exitmarche${i}`){
            let result = db.get('marche').find({ id: i }).update('note', n => n + 1).value();
            db.write();
            console.log(`Writing into ${payload}`);
          }
          else;
        }
        i=0;
        response = {"text": `Merci ! A bientôt !! ✌ `}
        callSendAPI(sender_psid, response);
        response = {"text": `Viens faire un tour sur notre site --> http://urlz.fr/75R3 👈`}
        callSendAPI(sender_psid, response);
        response = {"text": `Télécharge notre application sous android --> http://urlz.fr/75R4 👈`}
        console.log('Sending the exit message and adding the bonus'); 
      }
    
        // Sends the response message
  

  callSendAPI(sender_psid, response); 
}
// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}