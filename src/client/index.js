// src/client/index.js
const WebSocket = require('ws');
const { promptUser } = require('./prompts');
const { handleIncomingMessage } = require('./messageHandler');

const ws = new WebSocket('ws://localhost:8080');

// Handle incoming messages
ws.on('message', (message) => {
    handleIncomingMessage(message);
});

// When the connection opens, ask for username and room
ws.on('open', async () => {
    await promptUser(ws);
});
