'use strict';

var CollectableObj = require('client/gameObjects/CollectableObj');

var serverSocket, concernedPhaserState;

function synchronize(socket, phaserState){
    serverSocket = socket;
    concernedPhaserState = phaserState;

    // configure incoming traffic
    serverSocket.on('SERVER_PLAYER_ID', onReadyToRequestCollectables);
    serverSocket.on('SERVER_ALL_COLLECTABLES', onReceiveAllCollectables);
}

function onReadyToRequestCollectables(){
    serverSocket.emit('CLIENT_GET_ALL_COLLECTABLES');
}


function onReceiveAllCollectables(collectableList) {

    collectableList.forEach(function(collectable){

        var colObj = new CollectableObj({
            game : concernedPhaserState.game,
            x: collectable.x,
            y: collectable.y,
            isAvailable: collectable.isAvailable,
            type: collectable.type

        });
    });
}

function setConcernedPhaserState(state){
    concernedPhaserState = state;
}

module.exports = {
    synchronize : synchronize
};