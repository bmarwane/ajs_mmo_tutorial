
// game server : handle socket communication related to the game mechanics

var socketIO;

var GameServer = function(io){
    socketIO = io;
    return {
        start: function(){
            socketIO.on('connection', onClientConnected);
        }
    };
};

function onClientConnected(client){
    console.log('Client connected ...');
    client.on('REQUEST_ID', onRequestId);
    client.on('NOTIFY_PLAYER_MOVEMENT', onNotifyPlayerMovement);

    function onRequestId(playerInfo) {
        // respond the connected player with his ID
        client.emit('PLAYER_ID', client.id);

        // notify all the other players that a new player is connected
        notifyConnectedPlayer(client, playerInfo);
    }

    function notifyConnectedPlayer(client, playerInfo){
        playerInfo.uid = client.id;
        client.broadcast.emit('PLAYER_CONNECTED', playerInfo);
    }

    function onNotifyPlayerMovement(movementInfo){
        console.log("Moving Player", movementInfo);
        client.broadcast.emit('OTHER_PLAYER_MOVED', movementInfo);

    }
}


module.exports = GameServer;