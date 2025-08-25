import mongoose from "mongoose";

const conn = () => {
    // Include the database name 'test' in the connection string
    mongoose.connect("mongodb+srv://zeyad:zeyad2025@test.3lhioka.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0", {
    })
    .then(() => {
        console.log("Connected to MongoDB Atlas database: test");
        console.log("Database name:", mongoose.connection.name);
    })
    .catch((err) => {
        console.error("Database connection error:", err);
        console.error("Make sure your IP is whitelisted in MongoDB Atlas");
    });

    // Handle connection events
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to MongoDB Atlas');
    });
    
    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected from MongoDB Atlas');
    });
};

export default conn;