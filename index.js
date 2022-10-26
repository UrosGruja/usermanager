const express = require('express');
const dotenv = require('dotenv')

dotenv.config({ path: './config.env'});

const app = express();

const PORT = process.env.PORT || 8080;

console.log(PORT);

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));