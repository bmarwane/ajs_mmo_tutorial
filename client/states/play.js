'use stric';

var CharacterObj = require('client/gameObjects/CharacterObj');
var Pathfinder = require('client/utils/Pathfinder');
var NetworkManager = require('client/utils/NetworkManager');

function Play(){}

Play.prototype = {
    create: function(){
        this.game.stage.backgroundColor = 0xFFFFFF;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.initMap();
        this.initPathfinder();
        this.initCursor();
        this.addMainPlayer();

        this.connectToServer();

    },
    initMap: function(){
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.map.addTilesetImage('collision', 'walkables');

        this.walkableLayer = this.map.createLayer('collision');


        this.map.createLayer('ground');
        this.map.createLayer('obstacles');
        this.map.createLayer('obstacles2');

        this.walkableLayer.resizeWorld();
    },

    initPathfinder: function(){

        Pathfinder.init(this.game,
                        this.walkableLayer,
                        this.map.layers[3].data, // the layer containing the walkable tiles
                        [2017], // ID of the walkable tile ( the green one )
                        32
        );
    },

    initCursor: function(){
        this.marker = this.game.add.graphics();
        this.marker.lineStyle(2, 0x000000, 1);
        this.marker.drawRect(0, 0, Pathfinder.tileSize, Pathfinder.tileSize);

        this.input.onDown.add(function(event){
            this.updateCursorPosition();
            this.mainPlayer.moveTo(this.marker.x, this.marker.y, function(path){

            });
        }, this);

    },

    updateCursorPosition: function(){
        this.marker.x = this.walkableLayer.getTileX(this.game.input.activePointer.worldX) * 32;
        this.marker.y = this.walkableLayer.getTileY(this.game.input.activePointer.worldY) * 32;
    },

    addMainPlayer: function(){
        this.game.world.setBounds(0, 0, 1600, 1600);

        var startX = (6 * Pathfinder.tileSize) + (Pathfinder.tileSize / 2);
        var startY = (6 * Pathfinder.tileSize) + (Pathfinder.tileSize / 2);

        this.mainPlayer = new CharacterObj(this.game, startX, startY, true);
        this.game.camera.follow(this.mainPlayer.sprite);
    },

    connectToServer: function(){
        var me = this;
        NetworkManager.connect(this.mainPlayer);
        NetworkManager.onOtherPlayerConnected(function(otherPlayerInfo){
            me.addOtherPlayer(otherPlayerInfo);
        });
        NetworkManager.onOtherPlayerMove(function(movementInfo){
            var otherPlayerToMove = searchById(me.otherPlayers, movementInfo.uid);
            if(otherPlayerToMove){
                otherPlayerToMove.moveTo(movementInfo.x, movementInfo.y);
            }
        });

        NetworkManager.onUpdatePlayerList(function(receivedList){
            me.removeDisconnected(receivedList);
            me.addConnected(receivedList);

        });
        this.otherPlayers = [];
    },

    addOtherPlayer: function(otherPlayerInfo){
        var otherPlayer = new CharacterObj(this.game, otherPlayerInfo.x, otherPlayerInfo.y, false);
        otherPlayer.uid = otherPlayerInfo.uid;
        this.otherPlayers.push(otherPlayer);
    },

    removeDisconnected: function(receivedList){
        var newOtherPlayers = [];
        for(var i = 0, max = this.otherPlayers.length; i<max; i++){
            var otherPlayer = this.otherPlayers[i];
            // test if the player on this browser is still on the server list
            var playerInList = searchById(receivedList, otherPlayer.uid);

            if(playerInList){
                // keep the player
                newOtherPlayers.push(otherPlayer);
            } else {
                // remove from the game
                otherPlayer.destroy();
            }
        }
        this.otherPlayers = newOtherPlayers;
    },

    addConnected: function(receivedList){
        // search in the list if an element is not present in the otherPlayers, and not mainPlayer Add it

        for(var i = 0, max = receivedList.length; i<max;i++){
            var receivedPlayer = receivedList[i];
            if(receivedPlayer.uid !== this.mainPlayer.uid){
                var connectedPlayer = searchById(this.otherPlayers, receivedPlayer.uid);
                if(!connectedPlayer){
                    this.addOtherPlayer(receivedPlayer);
                }
            }

        }
    },

    update: function(){
        this.updateCursorPosition();
    }
};

function searchById(array, id){
    for(var i = 0, max = array.length; i < max; i++){
        var uid = array[i].getInfo ? array[i].getInfo().uid : array[i].uid;
        if(array[i] != null && uid === id){
            return array[i];
        }
    }
    return undefined;
}

function removeElementById(array, id){
    return array.filter(function( obj ) {
        return obj.uid !== id;
    });
}

module.exports = Play;