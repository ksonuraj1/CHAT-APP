import mongooose from 'mongoose';
import { DB_NAME } from '../../constants.js';

const connectDB = async () => {
  const MongoDbUri = process.env.MONGO_DB_URI;
  try {
    const connectionInstance = await mongooose.connect(
      `${MongoDbUri}/${DB_NAME}`
    );
    console.log(
      `Mongodb connected succesfully !!! DB:HOST :${connectionInstance?.connection.host}`
    );
  } catch (error) {
    console.log('mongodb connection failed...', error);
    process.exit(1);
  }
};

export { connectDB };
