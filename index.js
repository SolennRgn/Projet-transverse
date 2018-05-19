'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
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
  request('http://54.37.159.119/trouvetonexcuse/API/excuses.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var importedJSON = JSON.parse(body);
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
        "text": `Quel est la raison de votre message ? 🤔`
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
                    "payload": "absence1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "absence2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "absence3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='absence1'||payload==='absence2'||payload==='absence3'){
        humor = (payload==='absence1') ? 1 : ((payload==='absence2')? 2 : 3);
        console.log("humor var : " + humor)

        do {
          absence = importedJSON.absence[Math.floor((Math.random() * importedJSON.absence.length))];  
          console.log("Excuse : " + absence.text)
          console.log("humour : " + absence.humor)
          // Create the payload for a basic text message
        } while (absence.humor !== humor);
        response = {
          "text": `Voici ton excuse : ${absence.text} `
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
                    "payload": "exit",
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
                    "payload": "intercours1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "intercours2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "intercours3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='intercours1'||payload==='intercours2'||payload==='intercours3') {    
        // Create the payload for a basic text message
        humor = (payload==='intercours1') ? 1 : ((payload==='intercours2')? 2 : 3);
        console.log("humor var : " + humor)
        do {
          intercours = importedJSON.intercours[Math.floor((Math.random() * importedJSON.intercours.length))];;  
          console.log("Excuse : " + intercours.text)
          console.log("humour : " + intercours.humor)
          // Create the payload for a basic text message
        } while (intercours.humor !== humor);
        response = {
          "text": `Voici ton excuse : ${intercours.text}`
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
                    "payload": "exit",
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
      else if (payload==='bus1'||payload==='bus2'||payload==='bus3') {  
        humor = (payload==='bus1') ? 1 : ((payload==='bus2')? 2 : 3);
        console.log("humor var : " + humor)
        do {
          bus = importedJSON.bus[Math.floor((Math.random() * importedJSON.bus.length))];;  
          console.log("Excuse : " + bus.text)
          console.log("humour : " + bus.humor)
          // Create the payload for a basic text message
        } while (bus.humor !== humor);
        response = {
          "text": `Voici ton excuse : ${bus.text} `
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
                    "payload": "exit",
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
                    "payload": "train1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "train2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "train3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='train1'||payload==='train2'||payload==='train3') {  
        humor = (payload==='train1') ? 1 : ((payload==='train2')? 2 : 3);
        console.log("humor var : " + humor)
        do {
          train = importedJSON.train[Math.floor((Math.random() * importedJSON.train.length))];;  
          console.log("Excuse : " + train.text)
          console.log("humour : " + train.humor)
          // Create the payload for a basic text message
        } while (train.humor !== humor);
        response = {
          "text": `Voici ton excuse : ${train.text}`
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
                    "payload": "exit",
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
                    "payload": "marche1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "marche2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "marche3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='marche1'||payload==='marche2'||payload==='marche3') {  
        humor = (payload==='marche1') ? 1 : ((payload==='marche2')? 2 : 3);
        console.log("humor var : " + humor)
        do {
          marche = importedJSON.marche[Math.floor((Math.random() * importedJSON.marche.length))];;  
          console.log("Excuse : " + marche.text)
          console.log("humour : " + marche.humor)
          // Create the payload for a basic text message
        } while (marche.humor !== humor);
        response = {
          "text": `Voici ton excuse : ${marche.text} `
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
                    "payload": "exit",
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
                    "payload": "velo1",
                  },
                  {
                    "type": "postback",
                    "title": "Compréhensif 💁",
                    "payload": "velo2",
                  },
                  {
                    "type": "postback",
                    "title": "Amusant 😂",
                    "payload": "velo3",
                  }
                ],
              }]
            }
          }
        }
      }
      else if (payload==='velo1'||payload==='velo2'||payload==='velo3') {  
        humor = (payload==='velo1') ? 1 : ((payload==='velo2')? 2 : 3);
        console.log("humor var : " + humor)
        do {
          velo = importedJSON.velo[Math.floor((Math.random() * importedJSON.velo.length))];;  
          console.log("Excuse : " + velo.text)
          console.log("humour : " + velo.humor)
          // Create the payload for a basic text message
        } while (velo.humor !== humor);
        response = {
          "text": `Voici ton excuse : ${velo.text}`
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
                    "payload": "exit",
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
      }  
    }
        // Sends the response message
  callSendAPI(sender_psid, response); 
  })
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