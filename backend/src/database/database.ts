import mongoose from "mongoose";
import { config } from "../config/app.config";

const connectToDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Successfully connected to DB");
    } catch(err) {
        console.error("Failed to connect to DB")
        process.exit(1);
    }
}

export default connectToDB;