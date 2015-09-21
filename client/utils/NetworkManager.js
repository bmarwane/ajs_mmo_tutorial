'use stric';

var serverSocket, mainPlayer;
var otherPlayersInfos = [];
var onOtherPlayerConnectedCallback;
var onOtherPlayerMove;

var networkManager = {
    connected: false,
    connect: function (player) {
        mainPlayer = player;
        serverSocket = io.connect('http://192.168.1.7:9192');
        serverSocket.on('connect', onConnectedToServer);
        serverSocket.on('PLAYER_ID', onReceivePlayerId);

        serverSocket.on('PLAYER_CONNECTED', onPlayerConnected);
        serverSocket.on('REQUEST_PLAYER_LIST', onRequestPlayerList);
    },
    getNextPendingPlayer: function(){
        if(otherPlayersInfos.length > 0){
            otherPlayersInfos.shift();
        }
    },
    onOtherPlayerConnected: function(callback){
        onOtherPlayerConnectedCallback = callback;
    },
    onOtherPlayerMove: function(callback){
        onOtherPlayerMove = callback;
    },
    notifyMovement: function(movementInfo){
        serverSocket.emit('NOTIFY_PLAYER_MOVEMENT', movementInfo);
    }
};

function onConnectedToServer() {
    networkManager.connected = true;
    serverSocket.emit('REQUEST_ID', mainPlayer.getInfo());
}

function onReceivePlayerId(mainPlayerID) {
    mainPlayer.uid = mainPlayerID;
}

function onPlayerConnected(otherPlayer){
    console.log('a player is connected', otherPlayer);
    otherPlayersInfos.push(otherPlayer);
    onOtherPlayerConnectedCallback(otherPlayer);
}

function onOtherPlayerMoved(movementInfo){
    onOtherPlayerMove(movementInfo);
}


module.exports = networkManager;