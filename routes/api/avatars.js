const express = require('express')

const { upload, controllerWrapper, authenticate } = require('../../middlewares')
const { avatars } = require('../../controllers')

const router = express.Router()

router.patch(
  '/users/avatars',
  authenticate,
  upload.single('avatar'),
  controllerWrapper(avatars.updateAvatar),
)

module.exports = router
