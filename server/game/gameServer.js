// game server : handle socket communication related to the game mechanics

var ArrayUtils = require('../utils/Arrays');
var mapDataServer = require('./MapSync/mapDataServer');

var socketIO, listPlayers = [];
var NICKNAME_MAX_LENGTH = 16;
var MESSAGE_MAX_LENGTH = 100;

var GameServer = function(io){
    socketIO = io;
    return {
        start: function(){
            mapDataServer.init();
            socketIO.on('connection', onClientConnected);
        }
    };
};

function onClientConnected(client){
    console.log('Client connected ...');
    client.on('CLIENT_REQUEST_ID', onRequestId);
    client.on('CLIENT_NOTIFY_PLAYER_MOVEMENT', onNotifyPlayerMovement);
    client.on('CLIENT_REQUEST_PLAYER_LIST', onRequestPlayerList);
    client.on('CLIENT_CHAT_MESSAGE', onChatMessage);

    client.on('disconnect', onDisconnected);

    mapDataServer.synchronizeClient(client);

    function onRequestId(playerInfo) {
        // respond the connected player with his ID
        client.emit('SERVER_PLAYER_ID', client.id);

        // limit nickname size, and escape special characters
        playerInfo.nickname = filterInput(playerInfo.nickname, NICKNAME_MAX_LENGTH);

        // notify all the other players that a new player is connected
        notifyConnectedPlayer(client, playerInfo);
    }

    function notifyConnectedPlayer(client, playerInfo){
        playerInfo.uid = client.id;
        listPlayers.push(playerInfo);
        client.broadcast.emit('SERVER_PLAYER_CONNECTED', playerInfo);
    }

    function onNotifyPlayerMovement(movementInfo){
        client.broadcast.emit('SERVER_OTHER_PLAYER_MOVED', movementInfo);
        // update state on server
        var concernedPlayer = getPlayerById(movementInfo.uid);
        if(concernedPlayer){
            concernedPlayer.x = movementInfo.x;
            concernedPlayer.y = movementInfo.y;
        }
    }

    function onRequestPlayerList(){
        client.emit('SERVER_PLAYER_LIST', listPlayers);
    }

    function onDisconnected(){
        listPlayers = ArrayUtils.removeElementById(listPlayers, client.id);
        client.broadcast.emit('SERVER_PLAYER_LIST', listPlayers);
    }


    function onChatMessage(chatMessageInfo){
        chatMessageInfo.nickname = filterInput(chatMessageInfo.nickname, NICKNAME_MAX_LENGTH);
        chatMessageInfo.text = filterInput(chatMessageInfo.text, MESSAGE_MAX_LENGTH);

        client.broadcast.emit('SERVER_PLAYER_CHAT_MESSAGE', chatMessageInfo);
    }
}

function getPlayerById( id){
    return ArrayUtils.getObjectInArrayById(listPlayers, id);
}

// basic security check
function filterInput(input, maxLength){
    if(input.length > maxLength){
        input = input.substring(0,maxLength);
    }
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


module.exports = GameServer;