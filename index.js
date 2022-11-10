const path = require('path');
const express = require('express');
const dotenv = require('dotenv')
const morgan = require('morgan');
const fileupload = require('express-fileupload');
// const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./db');


dotenv.config({ path: './config.env'});

const users = require('./routes/user');
const auth = require('./routes/auth')

connectDB();

const app = express();

app.use(express.json());

app.use(fileupload());

app.use(express.static(path.join(__dirname, 'public')));

// app.use(cookieParser());

app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});