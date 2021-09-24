const express = require('express')
const router = express.Router()

const { contactSchema } = require('../../schemas')

const { controllerWrapper, validation } = require('../../middlewares')
const { contacts } = require('../../controllers')

router.get('/', controllerWrapper(contacts.listContacts))

router.get('/:contactId', controllerWrapper(contacts.getContactById))

router.post(
  '/',
  validation(contactSchema),
  controllerWrapper(contacts.addContact),
)

router.delete('/:contactId', controllerWrapper(contacts.removeContact))

router.put(
  '/:contactId',
  validation(contactSchema),
  controllerWrapper(contacts.updateById),
)

module.exports = router
