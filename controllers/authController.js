const UserService = require('../services/userServices')
const UserLayout = require('../layouts/userLayout')

class UserController{
  static async registerEmail (req, res, next){
    let {user} = req.body
    try {
      let newUser = await UserService.registerEmail(user, next)
      if (newUser){
        let layout = UserLayout.registerLayout(newUser)
        res.status(201).json(layout)
      }
    } catch (error) {
      next(error)
    }
  }

  static async login (req, res, next){
    let {user} = req.body

    try {
      let loggedUser
      if (user.google_token){
        let google_token = user.google_token
        loggedUser = await UserService.loginGoogle(google_token, next)
      } else {
        loggedUser = await UserService.loginEmail(user, next)
      }
      if (loggedUser){
        let layout = UserLayout.loginLayout(loggedUser)
        res.status(200).json(layout)
      }
    } catch (error) {
      next(error)
    }
  }

  static async verifOTP (req, res, next){
    let {verify} = req.body

    try {
        let verifyOTP = await UserService.verifyOTP(verify, next)
        if (verifyOTP){
          res.status(200).json(verifyOTP)
        }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController