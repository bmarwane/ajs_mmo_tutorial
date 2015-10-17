'use strict';

var DomHelper = require('client/utils/DomHelper');
var scoreList;


function init(){
    var scoreContainer = DomHelper.createElement('div', 'game-scoreboard');
    scoreContainer.style.left = DomHelper.getX(800) + 'px';
    scoreContainer.style.top = DomHelper.getY(0) + 'px';

    var title = document.createElement('h3');
    title.innerHTML = 'Scores';

    scoreList = DomHelper.createElement('ul', 'game-scorelist');

    scoreContainer.appendChild(title);
    scoreContainer.appendChild(scoreList);

    DomHelper.addToContainer(scoreContainer);
}

function setScores(scores){
    // empty the list
    while (scoreList.firstChild) {
        scoreList.removeChild(scoreList.firstChild);
    }

    scores.sort(orderByScore)
          .forEach(addScoreElement);

    function orderByScore(a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
    }
    function addScoreElement(scoreInfo){
        var listElement = document.createElement('li');
        listElement.innerHTML = '<strong>' + scoreInfo.nickname + '</strong>' + ' : ' + scoreInfo.score;

        scoreList.appendChild(listElement);
    }
}

module.exports = {
    init: init,
    setScores: setScores
};