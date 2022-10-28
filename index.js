const express = require('express');
const dotenv = require('dotenv')
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config.env'});

const connectDB = require('./db');

const users = require('./routes/user')

connectDB();

const app = express();

app.use(express.json());

app.use('/api/v1/users', users);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});