const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const routeUser = require('./routes/users');
const routeCard = require('./routes/cards');
const errorHandler = require('./errors/errorHandler');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }).unknown(true),
  }),
  login,
);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

app.use(auth);

app.use('/users', routeUser);
app.use('/cards', routeCard);

app.use('/', () => {
  throw new ErrorNotFound('Путь не найден');
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {

});
