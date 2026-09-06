import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auction_universe';
  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log(`✅ [MONGODB CONNECTED] Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};


