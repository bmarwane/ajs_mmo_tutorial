"use strict";

var gameBootstrapper = {
    init: function(){
        console.log('**** Game bootstrap ****');
        var game = new Phaser.Game(800, 460, Phaser.AUTO, 'game');

        game.state.add('boot', require('./states/boot'));
        game.state.add('play', require('./states/play'));

        game.state.start('boot');
    }
};

module.exports = gameBootstrapper;