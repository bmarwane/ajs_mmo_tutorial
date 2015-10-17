'use strict';

var containerElement, verticalOffset = 0, horizontalOffset = 0;

function getY(y){
    return y - verticalOffset;
}

function getX(x){
    return x - horizontalOffset;
}


module.exports = {
    init: function(game){
        containerElement = document.getElementById(game.parent);
        verticalOffset = game.height;
    },

    mediumPanel: function (x, y, cssClass){
        if(!cssClass){
            cssClass = '';
        }
        var panel = document.createElement('div');
        panel.className = 'gui-panel gui-panel-medium ' + cssClass;
        panel.style.left = getX(x) + 'px';
        panel.style.top = getY(y) + 'px';

        containerElement.appendChild(panel);

        return panel;
    },

    form: function(onSaveCallback){
        var form = document.createElement('form');
        form.onsubmit= function(){
            onSaveCallback();

            return false;
        };

        return form;
    },

    inputBlock: function(){
        var blockInput = document.createElement('div');
        blockInput.className='game-input-block';
        return blockInput;
    },

    inputWithLabel: function(parent, label, x, y){
        var nameLabel = document.createElement('div');
        nameLabel.className='game-gui-label';
        nameLabel.innerText = label;


        var nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'game-gui-input';

        parent.appendChild(nameLabel);
        parent.appendChild(nameInput);

        return nameInput;
    },

    createButton: function(label, cssClass){
        var button = document.createElement('button');
        button.className = cssClass;

        button.innerText = label;
        return button;
    },

    createElement: function(elementName, className){
        var element = document.createElement(elementName);
        element.className = className;
        return element;
    },

    addToContainer: function(element){
        containerElement.appendChild(element);
    },
    getX: getX,
    getY: getY

};