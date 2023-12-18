const mongoose = require('mongoose');

const connectDB = async (dbURL) => {
    try {
        await mongoose.connect(dbURL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
