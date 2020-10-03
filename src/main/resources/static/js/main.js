const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const messageArea = document.querySelector('#messageArea');
const connectingElement = document.querySelector('.connecting');

let username = null;
let stompClient = null;

const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(e) {
    username = document.querySelector('#name').value.trim();
    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/chat');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    e.preventDefault();
}

function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send('/app/chat.register',
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    );

    connectingElement.classList.add('hidden');
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);

    const messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        const avatarElement = document.createElement('i');
        const avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        const usernameElement = document.createElement('span');
        const usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    const textElement = document.createElement('p');
    const messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function onError(error) {
    connectingElement.textContent = 'Could not connect to server. Please try again!';
    connectingElement.style.color = 'red';
}

function send(e) {
    const messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };

        stompClient.send('/app/chat.send', {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    e.preventDefault();
}

function getAvatarColor(messageSender) {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    const index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', send, true);