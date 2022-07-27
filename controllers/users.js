const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Такой пользователь уже зарегистрирован.'));
      } else if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Неправильные почта или пароль.'));
      }

      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, matched]) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        next(new Unauthorized('Неправильные почта или пароль.'));
      }
      // аутентификация успешна
      const token = generateJWT(user._id);
      return token;
    })
    .then((token) => {
      res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized('Неправильные почта или пароль.'));
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user || req.params.userId)
    .then((user) => {
      if (!user || !(req.user._id === req.params.userId)) {
        next(new ErrorNotFound('Пользователь с указанным _id не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports.setAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные при обновлении аватара.'));
      } else if (err.name === 'CastError') {
        next(new ErrorNotFound('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.setMe = (req, res, next) => {
  const { about, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'CastError') {
        next(new ErrorNotFound('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};
