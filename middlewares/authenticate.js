const jwt = require('jsonwebtoken')

const { SECRET_KEY } = process.env
require('dotenv').config()

const { User } = require('../models')

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    res.status(401).json({
      status: '401 error',
      message: 'Not authorized',
    })
    return
  }

  const [bearer, token] = authorization.split(' ')
  if (bearer !== 'Bearer') {
    res.status(401).json({
      status: '401 error',
      message: 'Not authorized',
    })
    return
  }

  try {
    const { _id } = jwt.verify(token, SECRET_KEY)
    const user = await User.findById(_id)
    if (!user.token) {
      res.status(401).json({
        status: '401 error',
        message: 'Not authorized',
      })
      return
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({
      status: '401 error',
      message: 'Not authorized',
    })
  }
}

module.exports = authenticate
