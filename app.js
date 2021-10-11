//external import
const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

//internal import
const { notFoundHandler, errorHandler } = require('./src/middlewares/common/errorHandler');
const loginRouter = require('./src/router/loginRouter');
const usersRouter = require('./src/router/usersRouter');
const inboxRouter = require('./src/router/inboxRouter');

//dotenv config
dotenv.config();

//app
const app = express();

//socket creation
const server = http.createServer(app);
const io = require('socket.io')(server);
global.io = io;


app.use(fileUpload());

//request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log('Database connection successfully'))
    .catch(err => console.log('could not connect to database'));

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));

//set static folder
app.use(express.static(path.resolve(__dirname, 'public')));

//parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//routing setup
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/inbox', inboxRouter);

//404 not found
app.use(notFoundHandler);
app.use(errorHandler);

//app run
server.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});