'use strict';

var CharacterSpr = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'sprites');
    this.enableCollision();
    this.setupAnimations();
};

CharacterSpr.prototype = Object.create(Phaser.Sprite.prototype);
CharacterSpr.prototype.constructor = CharacterSpr;

CharacterSpr.prototype.enableCollision = function() {
    this.game.physics.p2.enable(this);
    this.body.fixedRotation = true;
};

CharacterSpr.prototype.setupAnimations = function() {
    this.animations.add('walk_down', [
        "walk/down/0.png",
        "walk/down/1.png",
        "walk/down/0.png",
        "walk/down/2.png"
    ], 60, true);
    this.animations.add('walk_up', [
        "walk/up/0.png",
        "walk/up/1.png",
        "walk/up/0.png",
        "walk/up/2.png"
    ], 60, true);

    this.animations.add('walk_side', [
        "walk/side/0.png",
        "walk/side/1.png",
        "walk/side/0.png",
        "walk/side/2.png"
    ], 60, true);

};

CharacterSpr.prototype.walkDown = function(){
    this.anchor.setTo(0.5, 0.5);

    this.animations.play("walk_down",6,true);
};

CharacterSpr.prototype.walkUp = function(){
    this.anchor.setTo(0.5, 0.5);

    this.animations.play("walk_up",6,true);
};

CharacterSpr.prototype.walkLeft = function(){
    this.anchor.setTo(0.5, 0.5);

    this.scale.x = 1;
    this.animations.play("walk_side",6,true);
};

CharacterSpr.prototype.walkRight = function(){
    this.anchor.setTo(0.5, 0.5);
    this.scale.x = -1;
    this.animations.play("walk_side",6,true);
};

module.exports = CharacterSpr;