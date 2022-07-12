class errorNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'errorNotFound';
    this.statusCode = 404;
  }
}

module.exports = errorNotFound;

// new errorNotFound('error 404')

// const obj = {
//   message: 'error 404',
//   name: 'errorNotFound',
//   statusCode: 404,
// };
