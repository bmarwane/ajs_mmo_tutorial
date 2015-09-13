"use strict";

var gameBootstrapper = {
    init: function(){
        console.log('**** Game bootstrap ****');
        var game = new Phaser.Game(800, 460, Phaser.AUTO, 'game');
    }
};

module.exports = gameBootstrapper;