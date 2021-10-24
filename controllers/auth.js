const { Conflict, NotFound, BadRequest } = require('http-errors')
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = process.env
const gravatar = require('gravatar')
const { generate } = require('shortid')
const verificationToken = generate()
const { sendEmail } = require('../helpers')

const signup = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }, '_id')

  if (user) {
    throw new Conflict('Email in use')
  }
  const newUser = new User({ email, verifyToken: verificationToken })

  newUser.setPassword(password)

  newUser.avatarURL = gravatar.url(email, {}, false)

  await newUser.save()

  const emailTemplate = {
    to: email,
    subject: 'Подтверждение регистрации',
    html: `Для подтверждения почты перейдите по ссылке <a href="http://localhost:3000/api/auth/users/verify/${verificationToken}" target="_blank">Подтвердить почту</a>`,
  }

  await sendEmail(emailTemplate)

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
  const user = await User.findOne(
    { email },
    '_id email password subscription verify',
  )
  if (!user || !user.comparePassword(password)) {
    throw new BadRequest('Email or password is wrong')
  }

  if (!user.verify) {
    throw new BadRequest('Email is not verified')
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
  const { email, subscription } = req.user

  res.json({
    status: '200 OK',
    data: {
      email: `${email}`,
      subscription: `${subscription}`,
    },
  })
}

const verify = async (req, res) => {
  const { verificationToken } = req.params
  const user = await User.findOne({ verificationToken })
  if (!user) {
    throw new NotFound('User not found')
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  })
  res.json({
    status: '200 OK',
    message: 'Verification is successful',
  })
}

const repeatVerify = async (req, res) => {
  const { email } = req.body

  if (!email) {
    res.json({
      status: '400',
      message: 'missing required field email',
    })
  }

  const user = await User.findOne(
    { email },
    '_id email password subscription verify',
  )

  if (user.verify) {
    throw new BadRequest('Verification has already been passed')
  }

  const emailTemplate = {
    to: email,
    subject: 'Повторное письмо для подтверждения регистрации',
    html: `Для подтверждения почты перейдите по ссылке <a href="http://localhost:3000/api/auth/users/verify/${verificationToken}" target="_blank">Подтвердить почту</a>`,
  }

  await sendEmail(emailTemplate)
  res.status(200).json({
    status: '200 OK',
    message: 'Verification email sent',
  })
}

module.exports = { signup, login, logout, current, verify, repeatVerify }
