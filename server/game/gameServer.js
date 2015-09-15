
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

    client.on('REQUEST_ID', function(playerInfo) {
        client.emit('PLAYER_ID', client.id);

        playerInfo.uid = client.id;
        client.broadcast.emit('PLAYER_CONNECTED', playerInfo);
    });

    client.on('PLAYER_INFO', function(data) {
        console.log('player info', data.x);
    });
}


module.exports = GameServer;