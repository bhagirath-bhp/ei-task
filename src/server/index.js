// src/server/index.js
const WebSocket = require('ws');
const { handleMessage, handleConnection, listUsersInRoom } = require('./rooms');
const { handleRegister, handleLogin } = require('./auth');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    handleConnection(ws);

    ws.on('message', async (message) => {
        const { type, username, password, room } = JSON.parse(message);

        if (type === 'register') {
            const result = handleRegister(username, password);
            ws.send(JSON.stringify(result));
        } else if (type === 'login') {
            const result = handleLogin(username, password);
            ws.send(JSON.stringify(result));
        } if (type === 'list') {
            const usersList = listUsersInRoom(room);
            ws.send(JSON.stringify({ success: true, message: usersList }));
        } else {
            handleMessage(ws, message);
        }
    });
});

console.log('Server is running on ws://localhost:8080');
