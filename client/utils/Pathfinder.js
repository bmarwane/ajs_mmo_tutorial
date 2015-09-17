'use strict';


var pathfinder;

module.exports = {
  init: function(game, walkableLayer, walkableLayerData, walkableTiles){

      this.walkableLayer = walkableLayer;
      pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
      pathfinder.setGrid(walkableLayerData, walkableTiles);
      
  },
    calculatePath: function(fromX, fromY, toX, toY, onPathReadyCallback){
        pathfinder.preparePathCalculation ([ fromX, fromY ],[ toX, toY ],onPathReadyCallback );

        pathfinder.calculatePath();
    }
};