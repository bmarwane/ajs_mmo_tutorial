'use stric';

var serverSocket, mainPlayer;

var networkManager = {
    connected: false,
    connect: function (player) {
        mainPlayer = player;
        serverSocket = io.connect('http://localhost:9192');
        serverSocket.on('connect', onConnectedToServer);
        serverSocket.on('PLAYER_ID', onReceivePlayerId);

        serverSocket.on('PLAYER_CONNECTED', onPlayerConnected);
    },
    sendPlayerInfo: function (playerInfo) {
        if (!networkManager.connected) return;

        serverSocket.emit('PLAYER_INFO', playerInfo);
    }
};

function onConnectedToServer() {
    networkManager.connected = true;
    serverSocket.emit('REQUEST_ID', mainPlayer.getInfo());
}

function onReceivePlayerId(data) {
    console.log('My ID', data);
    mainPlayer.uid = data;
}

function onPlayerConnected(otherPlayer){
    console.log('Player connected', otherPlayer);
}

module.exports = networkManager;