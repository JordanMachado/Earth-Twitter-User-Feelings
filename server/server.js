'use strict';

/* Creation des instance des modules Socket.io et Ntwitter */
var Twitter = require('ntwitter');
var io = require('socket.io').listen(9003);
/* Requete auprès de l'api */
var request;
/* tableau des keywords*/
var keywords = ['cool','love','happy','work','sad'];
/* Connection à l'api twitter */
var twitterClient = new Twitter(
{
    consumer_key: "2QaajODxbrgMqNTY7A7A1w",
    consumer_secret: "usDzR0W9Pg9eRVT7OXtq5IIm7U1VVxuLRTCNSKzUvRE",
    access_token_key: "829075742-n1VPHxhQ2w4BKo8RxPWXWGSgbg4u2hACut2hpn4e",
    access_token_secret: "jjXzv4hBAtWTnvbnCGnZ0MYHrcjM4ZcOWdv3aAF5p49c1"
});

/* Connection d'un client sur le serveur*/
io.sockets.on('connection', function  (socket) 
{
        /* Envoi de la requête auprès de l'api twitter en stream
        ** Stream permet d'écouter en continu l'api et d'envoyer des données recherchées
        */
        request = twitterClient.stream('statuses/filter', {'track': keywords}, function(stream) 
        {
          /* Evénement appelé lorsque l'on reçoi des données de la requête */
          stream.on('data', function (data) 
          {

            /* Si les coordonnées de geolocalisation ne sont pas null envoie des données */
            if(data.geo != null)
            {
              /* parcours du tableau de keywords */
              for (var i = 0; i<keywords.length; i ++)
              {

                 var keywordsInText = data.text.indexOf(keywords[i]) > 0; 
                  /* Si le keyword est présent dans le texte  envoi des donnée et du keyword */
                  if(keywordsInText)
                    socket.emit('tweet', data,keywords[i]);
              }
                    
            }
                        
          });
        });   
});

/* Déconnection client sur le serveur */
io.sockets.on('disconnect', function  (socket) 
{
  socket.disconnect();
});
