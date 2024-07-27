import { app } from './app.js';
import { connectDB } from './src/db/index.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port:${PORT}`);
    });
  })
  .catch((error) => console.log(error));
