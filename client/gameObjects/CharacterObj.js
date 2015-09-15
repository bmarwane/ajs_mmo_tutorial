'use stric';

var CharacterSpr = require('client/gameSprites/CharacterSpr');

var CharacterObj = function(game, x, y, isMainPlayer) {
    this.game = game;
    this.isMainPlayer = isMainPlayer;
    this.moveSpeed = 100;
    this.moving = false;
    this.info = {};

    this.setupSprite(x, y);
    this.sprite.walkDown();
};

CharacterObj.prototype.setupSprite = function(x, y){
    this.sprite = new CharacterSpr(this.game, x, y, this.isMainPlayer);
    this.game.add.existing(this.sprite);
};


CharacterObj.prototype.setPosition = function(x, y){
    this.sprite.position.x = x;
    this.sprite.position.y = y;
};


CharacterObj.prototype.moveUp = function(){
    this.sprite.walkUp();
    this.sprite.body.moveUp(this.moveSpeed);
    this.moving = true;
};

CharacterObj.prototype.moveDown = function(){
    this.sprite.walkDown();
    this.sprite.body.moveDown(this.moveSpeed);
    this.moving = true;
};

CharacterObj.prototype.moveLeft = function(){
    this.sprite.walkLeft();
    this.sprite.body.moveLeft(this.moveSpeed);
    this.moving = true;
};

CharacterObj.prototype.moveRight = function(){
    this.sprite.walkRight();
    this.sprite.body.moveRight(this.moveSpeed);
    this.moving = true;

};

CharacterObj.prototype.stopIfNoInput = function(){
    this.sprite.body.setZeroVelocity();
    this.moving = false;

};

CharacterObj.prototype.getInfo = function(){
  this.info.x = this.sprite.position.x;
  this.info.y = this.sprite.position.y;
  this.info.uid = this.uid;

  return this.info;
};

module.exports = CharacterObj;