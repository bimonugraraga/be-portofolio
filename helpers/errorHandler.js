function errHandler (err, req, res, next){
  console.log('====================================');
  console.log(err);
  console.log('====================================');
  if (err.code && err.code != 500) {
    res.status(err.code).json({
      status: err.code,
      message: err.message,
    });
  } else if (err.name === 'SequelizeValidationError') {
    let messages = [];
    for (let error in err.errors) {
      messages.push(err.errors[error].message)
    }
    res.status(400).json({
      status: 400,
      messages,
    });
  }else if(err.name === 'ParameterMissingError'){
    res.status(400).json({
      status: 400,
      message: err.message
    })
  } else {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}

module.exports = errHandler