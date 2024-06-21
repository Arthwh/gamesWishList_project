import app from './app.js';
import dotenv from 'dotenv';

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  dotenv.config();
  console.log(`Server running at ${address}`);
});

