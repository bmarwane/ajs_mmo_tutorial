'use stric';

var CharacterObj = require('client/gameObjects/CharacterObj');
var NetworkManager = require('client/utils/NetworkManager');

function Play(){}

Play.prototype = {
    create: function(){
        this.game.stage.backgroundColor = 0xFFFFFF;
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.initMap();
        this.addTestPlayer();
        this.setupKeys();

        this.connectToServer();
    },
    initMap: function(){
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.map.addTilesetImage('collision', 'walkables');

        this.layer = this.map.createLayer('ground');

        this.map.createLayer('obstacles');
        this.map.createLayer('obstacles2');

        this.map.setCollision(2018, true, "collision");
        this.game.physics.p2.convertTilemap(this.map, "collision");
        this.layer.resizeWorld();
    },
    addTestPlayer: function(){
        this.game.world.setBounds(0, 0, 1600, 1600);
        this.player = new CharacterObj(this.game, 200, 200, true);
        this.game.camera.follow(this.player.sprite);
    },

    setupKeys: function(){
        this.keys = {};
        this.keys.up = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.keys.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.keys.left = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.keys.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    },

    connectToServer: function(){
        var me = this;
        NetworkManager.connect(this.player);
        NetworkManager.onOtherPlayerConnected(function(otherPlayerInfo){
            me.addOtherPlayer(otherPlayerInfo);
        });
        this.otherPlayers = [];
    },

    update: function(){
        this.handlePlayerInputs();
    },

    handlePlayerInputs: function(){

        this.player.stopIfNoInput();
        if(this.keys.up.isDown){
            this.player.moveUp();
        }
        if(this.keys.down.isDown){
            this.player.moveDown();;
        }
        if(this.keys.left.isDown){
            this.player.moveLeft();
        }
        if(this.keys.right.isDown){
            this.player.moveRight();
        }

        if(this.player.moving){
            NetworkManager.sendPlayerInfo(this.player.getInfo());
        }
    },

    addOtherPlayer: function(otherPlayerInfo){
        console.log('adding other player');
        console.log(this);
        var otherPlayer = new CharacterObj(this.game, otherPlayerInfo.x, otherPlayerInfo.y, false);
        //this.otherPlayers.push(otherPlayer);
    }
};

module.exports = Play;