const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION, SHUTTING DOWN...');
  process.exit(1);
});

const app = require('./app');
const port = process.env.PORT || 8000;
const server = app.listen(port, () => `Server running on port ${port}`);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, SHUTTING DOWN...');
  server.close(() => {
    process.exit(1);
  });
});
