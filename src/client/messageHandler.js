// src/client/messageHandler.js

const handleIncomingMessage = (message) => {
    const { username, text } = JSON.parse(message);
    console.log(`${username}: ${text}`);
};

module.exports = { handleIncomingMessage };
