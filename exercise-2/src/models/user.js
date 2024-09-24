// src/server/models/user.js
const bcrypt = require('bcrypt');

const users = {}; // In-memory user storage

const register = (username, password) => {
    if (users[username]) {
        return { success: false, message: 'Username already exists.' };
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[username] = { password: hashedPassword };
    return { success: true, message: 'User registered successfully.' };
};

const login = (username, password) => {
    const user = users[username];
    if (user && bcrypt.compareSync(password, user.password)) {
        return { success: true, message: 'Login successful.' };
    }
    return { success: false, message: 'Invalid username or password.' };
};

const getUser = (username) => {
    return users[username] || null;
};

module.exports = { register, login, getUser };
