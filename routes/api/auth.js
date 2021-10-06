const express = require('express')
const router = express.Router()
const {
  controllerWrapper,
  validation,
  authenticate,
} = require('../../middlewares')
const { joiSchema } = require('../../models/user')

const { auth } = require('../../controllers')

router.post(
  '/users/signup',
  validation(joiSchema),
  controllerWrapper(auth.signup),
)

router.post(
  '/users/login',
  validation(joiSchema),
  controllerWrapper(auth.login),
)

router.get('/users/logout', authenticate, controllerWrapper(auth.logout))

router.get(
  '/users/current',
  validation(joiSchema),
  controllerWrapper(auth.current),
)

module.exports = router
