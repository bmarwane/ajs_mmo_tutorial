'use stric';


var CollectableObj = function(config) {
    this.game = config.game;
    this.isAvailable = config.isAvailable;
    this.type = config.type;
    this.uid = config.uid;

    this.sprite = this.game.add.sprite(config.x, config.y, 'sprites', 'collectables/' + this.type + '.png');
    this.sprite.collectableObj = this;

    this.sprite.anchor.setTo(0, 1);
    this.game.physics.arcade.enable(this.sprite);
    this.game.mmo_group_collectables.add(this.sprite);
};

CollectableObj.prototype.destroy = function() {
    this.sprite.kill();
};

module.exports = CollectableObj;