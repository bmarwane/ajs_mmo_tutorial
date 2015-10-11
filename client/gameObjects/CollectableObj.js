'use stric';


var CollectableObj = function(config) {
    this.game = config.game;
    this.isAvailable = config.isAvailable;
    this.type = config.type;

    this.sprite = this.game.add.sprite(config.x, config.y, 'sprites', 'collectables/' + this.type + '.png');

    this.sprite.anchor.setTo(0, 1);
    this.game.mmo_group_collectables.add(this.sprite);


};

CollectableObj.prototype = {

};

module.exports = CollectableObj;