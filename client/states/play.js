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
            this.player.moveTo(this.marker.x, this.marker.y, function(path){

            });
        }, this);

    },

    updateCursorPosition: function(){
        this.marker.x = this.walkableLayer.getTileX(this.game.input.activePointer.worldX) * 32;
        this.marker.y = this.walkableLayer.getTileY(this.game.input.activePointer.worldY) * 32;
    },

    addMainPlayer: function(){
        this.game.world.setBounds(0, 0, 1600, 1600);
        this.player = new CharacterObj(this.game, 6 * Pathfinder.tileSize, 6 * Pathfinder.tileSize, true);
        this.game.camera.follow(this.player.sprite);
    },

    connectToServer: function(){
        var me = this;
        NetworkManager.connect(this.player);
        NetworkManager.onOtherPlayerConnected(function(otherPlayerInfo){
            me.addOtherPlayer(otherPlayerInfo);
        });
        NetworkManager.onOtherPlayerMove(function(movementInfo){
            var otherPlayerToMove = searchById(me.otherPlayers, movementInfo.info.uid);
            if(otherPlayerToMove){
                otherPlayerToMove.moveTo(movementInfo.x, movementInfo.y);
            }
        });
        this.otherPlayers = [];
    },

    addOtherPlayer: function(otherPlayerInfo){
        var otherPlayer = new CharacterObj(this.game, otherPlayerInfo.x, otherPlayerInfo.y, true);
        otherPlayer.uid = otherPlayerInfo.uid;
        this.otherPlayers.push(otherPlayer);
    },

    update: function(){
        this.updateCursorPosition();
    }
};

function searchById(array, id){
    for(var i = 0, max = array.length; i < max; i++){
        if(array[i].getInfo().uid === id){
            return array[i];
        }
    }
    return undefined;
}

module.exports = Play;