const express = require('express');
const cors = require('cors');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

// CORS options
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

// Routers 
const authRouter = require('./router/authRouter');
const userRouter = require('./router/userRouter');
const parkingRouter = require('./router/parkingRouter');
const ownerRouter = require('./router/ownerRouter');
const contactFormRouter = require('./router/contactFormRouter');

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/parking', parkingRouter);
app.use('/api/v1/owner', ownerRouter);
app.use('/api/v1/contact', contactFormRouter);

//  404 route
app.all('*', (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
    next(err);
});


// Global error handler
app.use(globalErrorHandler);

module.exports = app;