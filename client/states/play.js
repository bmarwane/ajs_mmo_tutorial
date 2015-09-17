'use stric';

var CharacterObj = require('client/gameObjects/CharacterObj');
var NetworkManager = require('client/utils/NetworkManager');
var Pathfinder = require('client/utils/Pathfinder');

function Play(){}

Play.prototype = {
    create: function(){
        this.game.stage.backgroundColor = 0xFFFFFF;
        //this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.initMap();
        this.initPathfinder();
        this.initCursor();
        this.addTestPlayer();

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
                        [2017]); // ID of the walkable tile ( the green one )
    },

    initCursor: function(){
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.marker = this.game.add.graphics();
        this.marker.lineStyle(2, 0x000000, 1);
        this.marker.drawRect(0, 0, 32, 32);

        this.input.onDown.add(function(event){
            this.marker.x = this.walkableLayer.getTileX(this.game.input.activePointer.worldX) * 32;
            this.marker.y = this.walkableLayer.getTileY(this.game.input.activePointer.worldY) * 32;
            this.player.moveTo(this.marker.x, this.marker.y, function(path){
                console.log('end');
            });
        }, this);

    },

    addTestPlayer: function(){
        this.game.world.setBounds(0, 0, 1600, 1600);
        this.player = new CharacterObj(this.game, 200, 200, true);
        this.game.camera.follow(this.player.sprite);
    },

    connectToServer: function(){
        var me = this;
        NetworkManager.connect(this.player);
        NetworkManager.onOtherPlayerConnected(function(otherPlayerInfo){
            me.addOtherPlayer(otherPlayerInfo);
        });
        this.otherPlayers = [];
    },

    addOtherPlayer: function(otherPlayerInfo){
        console.log('adding other player');
        console.log(this);
        var otherPlayer = new CharacterObj(this.game, otherPlayerInfo.x, otherPlayerInfo.y, false);
        //this.otherPlayers.push(otherPlayer);
    }
};

module.exports = Play;