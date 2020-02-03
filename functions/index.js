/* eslint-disable consistent-return */
/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
'use-strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().database);

exports.sendNotification = functions.database.ref('/messages/{username}/{otherUser}/{push_id}').onWrite(async (change, event) =>  {
    const username = event.params.username;
    const otherUser = event.params.otherUser
    const push_id = event.params.push_id;
    console.log('The username is : ', username);
    console.log('The message id is : ', push_id);
    // if(!event.data.val()){
    // return console.log('Some Data got deleted ', notificationId);
    // }

    const messageId = admin.database().ref(`/messages/${username}/${otherUser}/${push_id}`).once('value');
       return messageId.then(msgObj => {

            const fromUserId = msgObj.val().from;
            const toUser = msgObj.val().to;
            const msgBody = msgObj.val().msg_body;
            const isRead = msgObj.val().isRead;
        if(!isRead){
                console.log('You have a message notification from : ', fromUserId);
            
                const deviceToken = admin.database().ref(`/Users/${toUser}/device_token`).once('value');
    
                return deviceToken.then(result => {
            
                    const tokenId = result.val();
            
                     const payload = {
                        data : {
                            fromUserId : "Xchanger",
                            title : "Xchanger",
                            body : "600 / 2 =?",
                            icon : "default",
                            sound: "default",
                            click_action : "com.example.xchanger.activity_first"
                        }
                    };
            
                    const response = admin.messaging().sendToDevice(tokenId, payload);
                  console.log('Message Notification sent successfully', response);
                   return response;
                    });
                
                }
        
            }); 
    });
  