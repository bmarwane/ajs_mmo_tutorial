'use strict';


var pathfinder;

module.exports = {
  init: function(game, walkableLayer, walkableLayerData, walkableTiles, tileSize){

      this.walkableLayer = walkableLayer;
      this.tileSize = tileSize;
      pathfinder = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
      pathfinder.setGrid(walkableLayerData, walkableTiles);
      
  },
    calculatePath: function(fromX, fromY, toX, toY, onPathReadyCallback){
        var fromTiles = [this.getTileX(fromX), this.getTileY(fromY)];
        var toTiles = [this.getTileX(toX), this.getTileY(toY)];
        pathfinder.preparePathCalculation (fromTiles, toTiles,onPathReadyCallback );

        pathfinder.calculatePath();
    },

    getTileX: function(value){
        return this.walkableLayer.getTileX(value);
    },
    getTileY: function(value){
        return this.walkableLayer.getTileY(value);
    }
};