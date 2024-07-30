// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const auth = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

//         if (!user) {
//             throw new Error();
//         }

//         req.token = token;
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: 'Please authenticate.' });
//     }
// };

// module.exports = auth;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log('Received Token:', token);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Payload:', decoded);
        
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        console.log('Authenticated User:', user);

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
