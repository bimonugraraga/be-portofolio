const {User, OTPassword} = require('../models')
const {verifPassword} = require('../helpers/passwordHandler')
const {signToken} = require('../helpers/jwtHandler')
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client('522799007698-mvham4urq6u4i95r12bqlb6n4eqp3p9k.apps.googleusercontent.com');
const secret = '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'
class UserService {
  static async registerEmail (params, next){
    try {
      let newUser = await User.create(params)
      if (newUser){
        return newUser
      }
    } catch (error) {
      next(error)
    }
  }

  static async loginEmail (params, next){
    try {
      let targetUser = await User.findOne({
        where: {
          email: params.email
        }
      })
      if (!targetUser){
        throw{
          code :404,
          message: "User Not Found"
        }
      }
      let checkOTP = await OTPassword.findOne({
        where: {
          user_id: targetUser.id
        }
      })
      if (checkOTP){
        throw{
          code :401,
          message: "User Not Verified Yet"
        }
      }
      let isPassword = verifPassword(params.password, targetUser.password)
      if (!isPassword){
        throw{
          code :401,
          message: "Invalid Password Or Email"
        }
      }
      let payload = {
        user_id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        password: targetUser.password,
        createdAt: targetUser.createdAt,
        updatedAt: targetUser.updatedAt
      }
      let access_token = signToken(payload)
      payload.access_token = access_token
      return payload
    } catch (error) {
      next(error)
    }
  }

  static async loginGoogle (params, next){
    try {
      const ticket = await client.verifyIdToken({
        idToken: params,
        audience: '522799007698-mvham4urq6u4i95r12bqlb6n4eqp3p9k.apps.googleusercontent.com'
      })
      
      let targetUser = await User.findOrCreate({
        where:{
          email: ticket.payload.email
        },
        defaults:{
          name: ticket.payload.name,
          email:ticket.payload.email,
          password: "AkuBimo123!",
          google_token: params
        }
      })
      let payload = {
        user_id: targetUser[0].id,
        email: targetUser[0].email,
        password: targetUser[0].password,
        createdAt: targetUser[0].createdAt,
        updatedAt: targetUser[0].updatedAt,
      }
      let access_token = signToken(payload)
      payload.google_token = targetUser[0].google_token
      payload.access_token = access_token
      return payload
    } catch (error) {
      next(error)
    }
  }

  static async verifyOTP (params, next){
    try {
      let targetOTP = await OTPassword.destroy({
        where: {
          user_id: params.user_id,
          otp_code: params.otp_code
        }
      })

      if (targetOTP === 0){
        throw {
          code: 400,
          message: "Wrong OTP"
        }
      }
      return {
        message: "Account Verified"
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserService