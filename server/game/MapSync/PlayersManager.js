'use strict';

var ArrayUtils = require('../../utils/Arrays');

var listPlayers = [];

function getPlayersList(){
    return listPlayers;
}

function addPlayer(playerInfo){
    listPlayers.push(playerInfo);
}

function removePlayerById(playerId){
    listPlayers = ArrayUtils.removeElementById(listPlayers, playerId);
}

function getPlayerById(id){
    return ArrayUtils.getObjectInArrayById(listPlayers, id);
}


module.exports = {
    getPlayersList: getPlayersList,
    addPlayer: addPlayer,
    removePlayerById: removePlayerById,
    getPlayerById: getPlayerById
};