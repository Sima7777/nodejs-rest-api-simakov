const express = require('express')
const router = express.Router()
const {
  controllerWrapper,
  validation,
  authenticate,
  uploadMiddleware,
} = require('../../middlewares')
const { joiSchema } = require('../../models/user')

const { auth } = require('../../controllers')

const { avatars } = require('../../controllers')

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

router.get('/users/current', authenticate, controllerWrapper(auth.current))

router.patch(
  '/users/avatars',
  authenticate,
  uploadMiddleware.single('avatar'),
  controllerWrapper(avatars.updateAvatar),
)

router.get('/users/verify/:verificationToken', controllerWrapper(auth.verify))

router.post('/users/verify/', controllerWrapper(auth.repeatVerify))

module.exports = router
