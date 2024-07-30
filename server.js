// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const bodyParser = require('body-parser');


// const app = express();

// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));


// const uri = process.env.MONGODB_URI;

// if (!uri) {
//     throw new Error('MONGODB_URI is not defined');
// }

// app.use('/', require('./route/user'));
// app.use('/form', require('./route/form'));

// mongoose.connect(uri)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure MONGODB_URI is defined
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MONGODB_URI is not defined');
}

// Routes
app.use('/auth', require('./middleware/auth'));
app.use('/users', require('./route/user'));
app.use('/forms',  require('./route/form'));

// MongoDB Connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
