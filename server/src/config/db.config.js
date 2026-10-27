import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("✅ MongoDB connected at:", conn.connection.host);
        console.log("📦 Database name:", conn.connection.name);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        console.log("⚠️ Retrying MongoDB connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;
