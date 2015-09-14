'use stric';

var CharacterSpr = require('client/gameSprites/CharacterSpr');

var CharacterObj = function(game, x, y) {
    this.game = game;
    this.moveSpeed = 100;

    this.setupSprite(x, y);
    this.sprite.walkDown();
};

CharacterObj.prototype.setupSprite = function(x, y){
    this.sprite = new CharacterSpr(this.game, x, y);
    this.game.add.existing(this.sprite);
};


CharacterObj.prototype.update = function(){

};


CharacterObj.prototype.moveUp = function(){
    this.sprite.walkUp();
    this.sprite.body.moveUp(this.moveSpeed);
};

CharacterObj.prototype.moveDown = function(){
    this.sprite.walkDown();
    this.sprite.body.moveDown(this.moveSpeed);

};

CharacterObj.prototype.moveLeft = function(){
    this.sprite.walkLeft();
    this.sprite.body.moveLeft(this.moveSpeed);

};

CharacterObj.prototype.moveRight = function(){
    this.sprite.walkRight();
    this.sprite.body.moveRight(this.moveSpeed);

};

CharacterObj.prototype.stopIfNoInput = function(){
    this.sprite.body.setZeroVelocity();

};

module.exports = CharacterObj;