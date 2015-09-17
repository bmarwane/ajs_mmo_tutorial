'use stric';

var CharacterSpr = require('client/gameSprites/CharacterSpr');
var Pathfinder = require('client/utils/Pathfinder');


var CharacterObj = function(game, x, y, isMainPlayer) {
    this.configure(game, isMainPlayer);
    this.setupSprite(x, y);
};

CharacterObj.prototype.configure = function(game, isMainPlayer){
    this.game = game;
    this.isMainPlayer = isMainPlayer;
    this.moveSpeed = 100;
    this.info = {};

    this.currentTweens = [];
    this.moving = false;
    this.tweenInProgress = false;
};

CharacterObj.prototype.setupSprite = function(x, y){
    this.sprite = new CharacterSpr(this.game, x, y, this.isMainPlayer);
    this.game.add.existing(this.sprite);

    this.sprite.walkRight();
};

CharacterObj.prototype.getCellX= function(col){
    return col * 32;
};
CharacterObj.prototype.getCellY= function(col){
    return col * 32;
};

CharacterObj.prototype.getTileX = function(value){
    return Pathfinder.walkableLayer.getTileX(value);
};
CharacterObj.prototype.getTileY = function(value){
    return Pathfinder.walkableLayer.getTileY(value);
};


CharacterObj.prototype.moveTo = function(targetX, targetY, pathReadyCallback){
    var me = this;

    Pathfinder.calculatePath(
        this.getTileX(this.sprite.position.x),
        this.getTileY(this.sprite.position.y),

        this.getTileX(targetX),
        this.getTileY(targetY),

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
};

CharacterObj.prototype.prepareMovement = function(listPoints){
    listPoints = listPoints || [];
    this.currentTweens = [];

    var me = this;

    listPoints.map(function(point){
        me.currentTweens.push(me.moveToXY(point.x * 32, point.y * 32));
    });

};

CharacterObj.prototype.moveToXY = function(x, y){
    var tween = this.game.add.tween(this.sprite.position);
    tween.to({x:x,y:y},this.moveSpeed);
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

        if(me.willTweenToNext()){
            tween.start();
            me.tweenInProgress = true;
        }else{
            me.onMovementInterrupted();
        }
    }
};

CharacterObj.prototype.onMovementInterrupted = function(){

};


CharacterObj.prototype.onStopMovement = function(){
    this.resetCurrentTweens();

};

CharacterObj.prototype.willTweenToNext = function(){
    return true;
};


CharacterObj.prototype.setPosition = function(x, y){
    this.sprite.position.x = x;
    this.sprite.position.y = y;
};


CharacterObj.prototype.getInfo = function(){
  this.info.x = this.sprite.position.x;
  this.info.y = this.sprite.position.y;
  this.info.uid = this.uid;

  return this.info;
};

module.exports = CharacterObj;