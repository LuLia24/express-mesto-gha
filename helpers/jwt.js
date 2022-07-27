const jwt = require('jsonwebtoken');

module.exports.generateJWT = (payload) => jwt.sign({ _id: payload }, 'some-secret-key', { expiresIn: '7d' });

module.exports.checkJWT = (token) => jwt.verify(token, 'some-secret-key');
