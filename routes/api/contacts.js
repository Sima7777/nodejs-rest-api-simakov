const express = require('express')
const router = express.Router()

const { joiSchema, updateFavoriteJoiSchema } = require('../../models')

const { controllerWrapper, validation } = require('../../middlewares')
const { contacts } = require('../../controllers')

router.get('/', controllerWrapper(contacts.listContacts))

router.get('/:contactId', controllerWrapper(contacts.getContactById))

router.post('/', validation(joiSchema), controllerWrapper(contacts.addContact))

router.delete('/:contactId', controllerWrapper(contacts.removeContact))

router.put(
  '/:contactId',
  validation(joiSchema),
  controllerWrapper(contacts.updateById),
)

router.patch(
  '/:contactId/favorite',
  validation(updateFavoriteJoiSchema),
  controllerWrapper(contacts.updateStatusContact),
)

module.exports = router
