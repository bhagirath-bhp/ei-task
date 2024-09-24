// src/server/rooms.js
const WebSocket = require('ws'); // Import the ws library
const rooms = {};

const handleConnection = (ws) => {
    ws.on('close', () => {
        // Clean up user from all rooms
        Object.keys(rooms).forEach(room => {
            rooms[room].clients.delete(ws);
            if (rooms[room].clients.size === 0) {
                delete rooms[room]; // Clean up empty rooms
            }
        });
    });
};

const handleMessage = (ws, message) => {
    try {
        const { room, username, text } = JSON.parse(message);

        // Initialize room if it doesn't exist
        if (!rooms[room]) {
            rooms[room] = { clients: new Set() };
        }

        // Set username in ws object
        ws.username = username; 
        rooms[room].clients.add(ws);

        // Handle exit command
        if (text === 'exit') {
            rooms[room].clients.delete(ws);
            ws.send(JSON.stringify({ success: true, message: `${username} has left the room.` }));
            return;
        }

        // Broadcast message to all clients in the room except the sender
        rooms[room].clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ username, text }));
            }
        });
    } catch (error) {
        console.error('Error parsing message:', error);
    }
};

const listUsersInRoom = (room) => {
    if (rooms[room] && rooms[room].clients.size > 0) {
        return Array.from(rooms[room].clients).map(client => client.username).join(', ');
    }
    return 'No users in this room.';
};


module.exports = { handleMessage, handleConnection, listUsersInRoom };
