const bcrypt = require("bcrypt");

const hashPassword = (Password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(Password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};
const comparePassword = (Password, hashed) => {
  return bcrypt.compare(Password, hashed);
};
module.exports = {
  hashPassword,
  comparePassword,
};
