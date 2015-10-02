'use stric';

var CharacterSpr = require('client/gameSprites/CharacterSpr');
var Pathfinder = require('client/utils/Pathfinder');
var NetworkManager = require('client/utils/NetworkManager');


var CharacterObj = function(game, x, y, isMainPlayer) {
    this.configure(game, isMainPlayer);
    this.setupSprite(x, y);
    this.resetCurrentTweens();
};

CharacterObj.prototype.configure = function(game, isMainPlayer){
    this.game = game;
    this.isMainPlayer = isMainPlayer;
    this.moveDuration = 500;
    this.info = {};

    this.currentTweens = [];
    this.moving = false;
    this.tweenInProgress = false;
};

CharacterObj.prototype.setupSprite = function(x, y){
    this.sprite = new CharacterSpr(this.game, x, y, this.isMainPlayer);
    this.game.add.existing(this.sprite);

    this.sprite.walkDown();
};

CharacterObj.prototype.moveTo = function(targetX, targetY, pathReadyCallback){
    var me = this;

    if(this.isMainPlayer) {
        NetworkManager.notifyMovement({x: targetX, y: targetY, uid: this.uid})
    }

    Pathfinder.calculatePath(
        this.sprite.position.x,
        this.sprite.position.y,
        targetX,
        targetY,
        function(path) {
            if (pathReadyCallback !== undefined || typeof pathReadyCallback === "function") {
                pathReadyCallback(path);
            }
            me.onReadyToMove(me, path);
        }
    );
};


CharacterObj.prototype.onReadyToMove = function(me, listPoints){
    this.resetCurrentTweens();
    this.prepareMovement(listPoints);
    this.moveInPath();
};

CharacterObj.prototype.resetCurrentTweens  = function(){
    var me = this;
    this.currentTweens.map(function(tween){
        me.game.tweens.remove(tween);
    });
    this.currentTweens = [];
    this.moving = false;
    this.sprite.stopAnimation();
};

CharacterObj.prototype.prepareMovement = function(listPoints){
    listPoints = listPoints || [];
    this.currentTweens = [];
    var me = this;

    listPoints.map(function(point){
        me.currentTweens.push(me.getTweenToCoordinate(point.x, point.y));
    });

};

CharacterObj.prototype.getTweenToCoordinate = function(x, y){
    var tween = this.game.add.tween(this.sprite.position);

    x = (x * Pathfinder.tileSize) + Pathfinder.tileSize / 2;
    y = (y * Pathfinder.tileSize) + Pathfinder.tileSize / 2;
    tween.to({ x:x, y:y }, this.moveDuration);
    return tween;
};

CharacterObj.prototype.moveInPath = function() {
    if(this.currentTweens.length === 0){
        return;
    }
    var index = 1, me = this;
    this.moving = true;


    moveToNext(this.currentTweens[index]);


    function moveToNext(tween){

        index ++;
        var nextTween = me.currentTweens[index];
        if(nextTween != null){

            tween.onComplete.add(function(){
                me.tweenInProgress = false;
                moveToNext(nextTween);
            });
        }else{
            // if i am the last tween
            tween.onComplete.add(function(){
                me.onStopMovement();
            });
        }

        tween.start();
        me.faceNextTile(tween);

        me.tweenInProgress = true;
    }
};

CharacterObj.prototype.faceNextTile = function(tween){

    var isVerticalMovement = tween.properties.y == this.sprite.position.y;

    if(isVerticalMovement) {
        if(tween.properties.x > this.sprite.position.x){
            this.sprite.walkRight();
        } else {
            this.sprite.walkLeft();
        }
    } else {
        if(tween.properties.y > this.sprite.position.y){
            this.sprite.walkDown();
        } else {
            this.sprite.walkUp();
        }

    }
};



CharacterObj.prototype.onStopMovement = function(){
    this.resetCurrentTweens();

};

CharacterObj.prototype.setPosition = function(x, y){
    this.sprite.position.x = x;
    this.sprite.position.y = y;
};

CharacterObj.prototype.destroy = function(){
  this.sprite.destroy();
};


CharacterObj.prototype.getInfo = function(){
  this.info.x = this.sprite.position.x;
  this.info.y = this.sprite.position.y;
  this.info.uid = this.uid;
  this.info.nickname = this.nickname;

  return this.info;
};

module.exports = CharacterObj;