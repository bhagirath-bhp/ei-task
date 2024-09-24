// src/server/auth.js
const { register, login } = require('../models/user');

const handleRegister = (username, password) => {
    return register(username, password);
};

const handleLogin = (username, password) => {
    return login(username, password);
};

module.exports = { handleRegister, handleLogin };
