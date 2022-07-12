const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routeUser = require('./routes/users');
const routeCard = require('./routes/cards');
const errorHandler = require('./errors/errorHandler');
const ErrorNotFound = require('./errors/ErrorNotFound');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62caa0e6ff0feea9ed2d8147', // Пикассо
  };

  next();
});

app.use('/users', routeUser);
app.use('/cards', routeCard);
app.use('/', (next) => {
  next(new ErrorNotFound('Путь не найден'));
});

app.use(errorHandler);

app.listen(PORT, () => {

});
