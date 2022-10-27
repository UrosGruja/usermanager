const express = require('express');
const dotenv = require('dotenv')
const morgan = require('morgan');
const connectDB = require('./db');

dotenv.config({ path: './config.env'});

connectDB();

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});