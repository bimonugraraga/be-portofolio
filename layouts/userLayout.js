class UserLayout {
  static registerLayout (params){
    let result = {
      user_id: params.id,
      name: params.name,
      email: params.email,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt
    }

    return result
  }

  static loginLayout (params){
    let result = {
      user_id: params.id,
      email: params.email,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      access_token: params.access_token,
      google_token: params.google_token? params.google_token : null
    }
    return result
  }
}

module.exports = UserLayout