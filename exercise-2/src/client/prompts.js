// src/client/prompts.js
const inquirer = require('inquirer').default;



const promptUser = async (ws) => {
    const { username, password } = await inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'What is your username?',
        },
        {
            type: 'input',
            name: 'password',
            message: 'What is your password?',
        },
    ]);

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Do you want to register or log in?',
            choices: ['Register', 'Login'],
        },
    ]);

    const type = action === 'Register' ? 'register' : 'login';
    ws.send(JSON.stringify({ type, username, password }));

    ws.on('message', (response) => {
        const { success, message } = JSON.parse(response);
        console.log(message);
        if (success) {
            askRoom(ws, username);
        }
    });
};

const askRoom = async (ws, username) => {
    const { room } = await inquirer.prompt([
        {
            type: 'input',
            name: 'room',
            message: 'Which room do you want to join?',
        },
    ]);

    console.log(`Welcome to the room: ${room}`);
    sendMessage(ws, username, room);
};

const sendMessage = async (ws, username, room) => {
    const { text } = await inquirer.prompt([
        {
            type: 'input',
            name: 'text',
            message: 'Type your message:',
        },
    ]);

    if (text.startsWith('/')) {
        handleCommand(ws, username, room, text);
    } else {
        ws.send(JSON.stringify({ room, username, text }));
    }

    sendMessage(ws, username, room); // Continue asking for messages
};

const handleCommand = (ws, username, room, command) => {
    const args = command.split(' ');

    switch (args[0]) {
        case '/help':
            console.log('Available commands:\n/help - Show this help message.\n/list - List users in the current room.\n/exit - Leave the current room.');
            break;
        case '/list':
            ws.send(JSON.stringify({ type: 'list', room })); // Notify server to list users
            break;
        case '/exit':
            ws.send(JSON.stringify({ type: 'exit', room, username }));
            console.log('You have left the room.');
            break;
        default:
            console.log('Unknown command. Type /help for a list of commands.');
            break;
    }
};

module.exports = { promptUser, sendMessage };
