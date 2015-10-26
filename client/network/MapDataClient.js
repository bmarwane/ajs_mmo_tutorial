'use strict';

var CollectableObj = require('client/gameObjects/CollectableObj');
var scoreBoard = require('client/utils/ScoreBoard');

var serverSocket, concernedPhaserState;
var collectableObjects = [];

function synchronize(socket, phaserState){
    serverSocket = socket;
    concernedPhaserState = phaserState;

    // configure incoming traffic
    serverSocket.on('SERVER_PLAYER_ID', onReadyToRequestCollectables);
    serverSocket.on('SERVER_ALL_COLLECTABLES', onReceiveAllCollectables);
    serverSocket.on('SERVER_COLLECTABLE_DESTROY', onDestroyCollectable);
    serverSocket.on('SERVER_UPDATE_PLAYER_SCORES', onReceiveScores);

    // initialize score board
    scoreBoard.init();
}

function onReadyToRequestCollectables(){
    serverSocket.emit('CLIENT_GET_ALL_COLLECTABLES');
}

function onDestroyCollectable(newCollectableInfo){
    var collectableIdToDestroy = newCollectableInfo.uid;

    var collectableToDestroy = collectableObjects.filter(function(collectable){
        return (collectable.uid === collectableIdToDestroy);
    })[0];


    if(collectableToDestroy !== undefined){
        collectableToDestroy.destroy();
    }
}

function onReceiveScores(playersList){
    scoreBoard.setScores(playersList);
}

function tryToCollectForPlayer(collectable, player){
    serverSocket.emit('CLIENT_TRY_TO_COLLECT', { collectableId: collectable.uid, playerId: player.uid});
}



function onReceiveAllCollectables(collectableList) {
    destroyAllCollectables();

    collectableList.forEach(function(collectable){

        if(collectable.isAvailable){
            var colObj = new CollectableObj({
                game : concernedPhaserState.game,
                x: collectable.x,
                y: collectable.y,
                isAvailable: collectable.isAvailable,
                type: collectable.type,
                uid: collectable.uid
            });
        }
        collectableObjects.push(colObj);
    });
}

function destroyAllCollectables(){
    collectableObjects.forEach(function(colObject){
        if(colObject){
            colObject.destroy();
        }
    });
    collectableObjects = [];
}

function setConcernedPhaserState(state){
    concernedPhaserState = state;
}

module.exports = {
    synchronize : synchronize,
    tryToCollectForPlayer: tryToCollectForPlayer
};