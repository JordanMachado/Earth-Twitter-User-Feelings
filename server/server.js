'use strict';

/* Creation des instances des modules Socket.io et Ntwitter */
var Twitter = require('ntwitter');
var io = require('socket.io').listen(9003);

// Request twitter track
var request;

// Array Keywords
var keywords = ['cool','love','happy','work','sad'];

/* Connection API twitter
 * To create an application twitter you have to register at https://dev.twitter.com/
 * And they will give you your consumerKey/secret and access token 
*/
var twitterClient = new Twitter(
{
    consumer_key: "XXXXXXX",
    consumer_secret: "XXXXXXX",
    access_token_key: "XXXXXXX",
    access_token_secret: "XXXXXXX"
});

// On client connection 
io.sockets.on('connection', function  (socket) 
{
        // Event whish tracking in real time the keywords 
        request = twitterClient.stream('statuses/filter', {'track': keywords}, function(stream) 
        {
          // Event called when data is sended
          stream.on('data', function (data) 
          {
            // if geolocalization is defined
            if(data.geo != null)
            {
              // for each keywords
              for (var i = 0; i<keywords.length; i ++)
              {

                 var keywordsInText = data.text.indexOf(keywords[i]) > 0; 
                 // if the keyword is in the text send data and the keyword
                  if(keywordsInText)
                    socket.emit('tweet', data,keywords[i]);
              }
                    
            }
                        
          });
        });   
});

/* On client deconnection */
io.sockets.on('disconnect', function  (socket) 
{
  socket.disconnect();
});
