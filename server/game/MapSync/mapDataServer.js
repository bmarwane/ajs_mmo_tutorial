/*
 * Manage Main map Objects
 */
var MapFile = require('../../../client/assets/gameAssets/map/map.json');

var Gold = require('./Collectable/Gold');

var collectableObjects = [];

const COLLECTABLE_LAYER_NAME = "s_collectable";

// init the map objects that need to be synchronized
function init(){
    loadCollectablesFromMapFile();
}

function loadCollectablesFromMapFile(){
    var collectableLayer = MapFile.layers.filter(function( layer ) {
        return layer.name === COLLECTABLE_LAYER_NAME;
    })[0];

    var counter = 0;
    collectableLayer.objects.forEach(function(colObject){
        if(colObject.type === 'Gold'){
            collectableObjects.push(new Gold(counter, colObject.x, colObject.y));
            counter++;
        }
    });

    console.log('** Collectable objects loaded');
}


function synchronizeClient(client){
    client.on('CLIENT_GET_ALL_COLLECTABLES', onGetAllCollectables);

    function onGetAllCollectables() {
        client.emit('SERVER_ALL_COLLECTABLES', collectableObjects);
    }
}



module.exports = {
    init: init,
    synchronizeClient: synchronizeClient
};