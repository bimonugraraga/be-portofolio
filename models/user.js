'use strict';
const {
  Model
} = require('sequelize');
const {hashPassword} = require('../helpers/passwordHandler')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.OTPassword, {foreignKey: "user_id"})
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email Has Been Taken'
      },
      validate: {
        notNull: {
          msg: 'Email is Required'
        },
        notEmpty: {
          msg: 'Email is Required'
        },
        isEmail: {
          msg: 'Invalid Email Format'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is Required'
        },
        notEmpty: {
          msg: 'Name is Required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is Required'
        },
        notEmpty: {
          msg: 'Password is Required'
        },
        reqPassword(value){
          if (value.length < 8){
            throw new Error('Password Length Minimum 8');
          }
          let upper = false
          let lower = false
          let special = false
          let numeric = false
          let dictionary = '`!@#$%^&*()_+~-='
          for (let i = 0; i < value.length; i++){
            if (value[i] == Number(value[i])){
              numeric = true
            } else {
              if (value[i] === value[i].toUpperCase()){
                upper = true
              }
              if (value[i] === value[i].toLowerCase()){
                lower = true
              }

              for (let j = 0; j < dictionary.length; j++){
                if (value[i] === dictionary[j]){
                  special = true
                }
              }
            }
          }
          if (!upper || !lower || !numeric || !special){
            throw new Error('Invalid Password Requirement');
          }
        }
      }
    },
    google_token: DataTypes.TEXT
  }, {
    sequelize,
    hooks: {
      beforeCreate: (value) => {
        value.password = hashPassword(value.password)
      },
      afterCreate: async(user, option) => {
        if (!user.google_token){
          let params = {
            user_id: user.id,
            otp_code: Math.floor(1000 + Math.random() * 9000),
          }
          await sequelize.models.OTPassword.create(params, {
            transaction: option.transaction
          })
        }
      }
    },
    modelName: 'User',
  });
  return User;
};