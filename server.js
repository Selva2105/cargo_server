const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
const app = require('./app');
const connectDB = require('./utils/dbConnection');

// To handle if any uncaught exception occurs
process.on('uncaughtException', (err) => {
    console.error("Error message:", err.message);
    console.error("Error name:", err.name);
    console.error('Uncaught exception occurred. Shutting down :(');
    process.exit(1);
});

const PORT = process.env.PORT || 3000;
const REMOTE_DBURL = process.env.REMOTE_DB_URL;

// Call the MongoDB connection function
connectDB(REMOTE_DBURL);

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

// To handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error("Error message:", err.message);
    console.error("Error name:", err.name);
    console.error('Unhandled rejections occurred. Shutting down :(');

    server.close(() => {
        process.exit(1);
    });
});
