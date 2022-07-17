var bcrypt = require('bcryptjs');

function hashPassword(password){
  return bcrypt.hashSync(password, 8);
}

function verifPassword(password,hash){
 return bcrypt.compareSync(password, hash); // true
}

module.exports = {
  hashPassword,
  verifPassword
}