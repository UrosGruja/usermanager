const path = require('path');
const express = require('express');
const dotenv = require('dotenv')
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./api-docs/swagger');
const errorHandler = require('./middleware/error');
const connectDB = require('./db');


dotenv.config({ path: './config.env'});

const users = require('./routes/user');
const auth = require('./routes/auth')

connectDB();


const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(express.json());

app.use(fileupload());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}/api-docs`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});