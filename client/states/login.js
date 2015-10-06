'use strict';

var ChatManager = require('client/utils/ChatManager');
var DomHelper = require('client/utils/DomHelper');

var nickNameInput;
var domToRemove = [];

function Login(){}


Login.prototype = {

    create: function(){
        this.game.stage.backgroundColor = 0x66990D;

        DomHelper.init(this.game);
        domToRemove = [];
        this.showLoginPanel();
    },
    showLoginPanel: function(){
        var me = this;
        var panel = DomHelper.mediumPanel(180, 120, 'game-login-panel');
        var form = DomHelper.form(saveName);
        var blockInput = DomHelper.inputBlock();

        nickNameInput = DomHelper.inputWithLabel(blockInput, 'Enter a nickname', 200, 200);

        var saveButton = DomHelper.createButton('GO !!', 'game-login-button');

        form.appendChild(blockInput);
        form.appendChild(saveButton);
        panel.appendChild(form);

        domToRemove.push(panel); // removing the panel will remove all its childs

        function saveName(){
            me.game.mainPlayerName = ChatManager.setMainPlayerName(nickNameInput.value);
            if(me.game.mainPlayerName){
                me.cleanDom();
                me.game.state.start('play');
             }
             nickNameInput.value = '';
        }
    },

    cleanDom: function(){
        for(var i = 0, max = domToRemove.length; i < max; i++){
            domToRemove[i].remove();
        }
    }
};

module.exports = Login;