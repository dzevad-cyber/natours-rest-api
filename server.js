import mongoose from 'mongoose';

import app from './app.js';

process.on('uncaughtException', err => {
  console.log('UNHANDLED REJECTION! SHUTTING DOWN!!!');
  console.log(err.name, err.message);
  console.log(err.stack);

  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! SHUTTING DOWN!!!');
  console.log(err.name, err.message);
  console.log(err.stack);

  server.close(() => process.exit(1));
});
