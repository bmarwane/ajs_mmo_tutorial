'use stric';

var NetworkManager = require('client/utils/NetworkManager');

var chatInput, messagesBox, onMainPlayerSendMessageCallback;

function init(containerId){
    initGuiElements(containerId);
    appendMessage('SYSTEM', 'Welcome');
}

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

    onMainPlayerSendMessageCallback(textMessage);

    NetworkManager.sendChatMessage(textMessage);

    chatInput.value = '';

    return false;
}

function onMainPlayerSendMessage(callback){
    onMainPlayerSendMessageCallback = callback;
}

function appendMessage(author, message){
    var htmlMessage = '<span class="message-author"> [' + author + ']</span> : ' + message;
    messagesBox.innerHTML += htmlMessage + '<br />';
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
    onMainPlayerSendMessage: onMainPlayerSendMessage
};