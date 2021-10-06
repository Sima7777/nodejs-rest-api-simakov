const express = require('express')
const router = express.Router()

const { updateFavoriteJoiSchema } = require('../../models')
const { joiSchema } = require('../../models/contact')

const {
  controllerWrapper,
  validation,
  authenticate,
} = require('../../middlewares')
const { contacts } = require('../../controllers')

router.get('/', authenticate, controllerWrapper(contacts.listContacts))

router.get(
  '/:contactId',
  authenticate,
  controllerWrapper(contacts.getContactById),
)

router.post(
  '/',
  authenticate,
  validation(joiSchema),
  controllerWrapper(contacts.addContact),
)

router.delete(
  '/:contactId',
  authenticate,
  controllerWrapper(contacts.removeContact),
)

router.put(
  '/:contactId',
  authenticate,
  validation(joiSchema),
  controllerWrapper(contacts.updateById),
)

router.patch(
  '/:contactId/favorite',
  authenticate,
  validation(updateFavoriteJoiSchema),
  controllerWrapper(contacts.updateStatusContact),
)

module.exports = router
