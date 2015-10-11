'use strict';

var NetworkManager = require('client/network/NetworkManager');

var chatInput, messagesBox;
var mainPlayerName;

function init(containerId){
    initGuiElements(containerId);
    appendSystemMessage('info', 'Welcome ' + mainPlayerName + ' to this Demo');
}

/*
 Create the html structure that correspond to this :

 <div id="game-chat-box">
     <div class="game-chat-messages">
        Messages goes here
     </div>
     <form>
        <input type="text" class="game-chat-input">
     </form>
 </div>
 */
function initGuiElements(containerId){
    var container = document.getElementById(containerId);

    var chatBox = document.createElement('div');
    chatBox.id = 'game-chat-box';

    messagesBox = document.createElement('div');
    messagesBox.className = 'game-chat-messages';

    var chatForm = document.createElement('form');

    chatForm.onsubmit= onSendMessage;

    chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.className = 'game-chat-input';

    chatForm.appendChild(chatInput);

    chatBox.appendChild(messagesBox);
    chatBox.appendChild(chatForm);

    container.appendChild(chatBox);
}

function onSendMessage(){
    var textMessage = escapeHtml(chatInput.value);

    NetworkManager.sendChatMessage(textMessage);

    appendMessage(mainPlayerName, textMessage);

    chatInput.value = '';

    return false;
}

function appendSystemMessage(type, message){
    appendMessage('*', message, type);
}

function appendMessage(author, message, messageType){
    var cssTypeSuffix = '';
    if(messageType !== undefined){
        cssTypeSuffix = 'game-message-type-' + messageType;
    }

    var htmlMessage = '<span class="game-message ' + cssTypeSuffix + '"><span class="game-message-author"> [' + author + ']</span> : ' + message + '</span>';
    messagesBox.innerHTML += htmlMessage + '<br />';

    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function setMainPlayerName(nickName){
    if(!nickName || nickName.length === 0){
        return false;
    }
    mainPlayerName = escapeHtml(nickName);
    return mainPlayerName;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

module.exports = {
    init: init,
    appendMessage: appendMessage,
    systemMessage: appendSystemMessage,
    setMainPlayerName: setMainPlayerName
};