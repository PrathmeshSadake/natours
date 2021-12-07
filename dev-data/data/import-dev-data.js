const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to Mongo Database');
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully added!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
    await importData();
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

deleteData();
