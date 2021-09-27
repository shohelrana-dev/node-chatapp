//externerl import
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

//internal import
const { notFoundHandler, errorHandler } = require('./src/middlewares/common/errorHandler');

//dotenv config
dotenv.config();

//app
const app = express();

//request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(data => console.log('Database connection successfully'))
    .catch(err => console.log('could not connect to database'));

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));

//set static folder
app.use(express.static(path.resolve(__dirname, 'public')));

//parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//routing setup

//404 not found
app.use(notFoundHandler);
app.use(errorHandler);

//app run
app.listen(process.env.PORT, () => {
    console.log(`App listeining on port ${process.env.PORT}`);
});