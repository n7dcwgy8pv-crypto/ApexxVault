import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auction_universe';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      autoIndex: true
    });
    console.log(`\n========================================`);
    console.log(`[MONGODB CONNECTED] Host: ${conn.connection.host}`);
    console.log(`[DATABASE NAME]    : ${conn.connection.name}`);
    console.log(`[CONNECTION URL]   : ${MONGODB_URI}`);
    console.log(`========================================\n`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};
