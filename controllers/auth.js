const { Conflict } = require('http-errors')

const { User } = require('../models')

const jwt = require('jsonwebtoken')
const { SECRET_KEY } = process.env
const { BadRequest } = require('http-errors')

const signup = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }, '_id')

  if (user) {
    throw new Conflict('Email in use')
  }
  const newUser = new User({ email })

  newUser.setPassword(password)

  await newUser.save()

  res.status(201).json({
    status: '201 Created',
    user: {
      email: `${email}`,
      subscription: 'starter',
    },
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }, '_id email password subscription')
  if (!user || !user.comparePassword(password)) {
    throw new BadRequest('Email or password is wrong')
  }

  const { _id, subscription } = user
  const payload = {
    _id,
  }
  const token = jwt.sign(payload, SECRET_KEY)

  await User.findByIdAndUpdate(_id, { token })
  res.json({
    status: '200 OK',
    data: {
      token: `${token}`,
      user: {
        email: `${email}`,
        subscription: `${subscription}`,
      },
    },
  })
}

const logout = async (req, res) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: null })
  res.json({
    status: 'success',
    code: 200,
    message: 'Success logout',
  })
}

const current = async (req, res) => {
  const { token } = req.body
  const user = await User.findOne(
    { token },
    '_id email password subscription token',
  )
  const { email, subscription } = user
  if (!user) {
    throw new BadRequest('Not authorized')
  }
  res.json({
    status: '200 OK',
    data: {
      email: `${email}`,
      subscription: `${subscription}`,
    },
  })
}

module.exports = { signup, login, logout, current }
