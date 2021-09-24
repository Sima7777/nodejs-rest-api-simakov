const { NotFound } = require('http-errors')
const { sendSuccessRes } = require('../helpers')
const productsOperations = require('../model')

const listContacts = async (req, res) => {
  const result = await productsOperations.listContacts()
  sendSuccessRes(res, { result })
}

const getContactById = async (req, res) => {
  const { contactId } = req.params

  const result = await productsOperations.getContactById(contactId)
  if (!result) {
    throw new NotFound(`Product with id=${contactId} not found`)
  }
  sendSuccessRes(res, { result })
}

const addContact = async (req, res) => {
  const result = await productsOperations.addContact(req.body)
  sendSuccessRes(res, { result }, 201)
}

const updateById = async (req, res) => {
  const { contactId } = req.params
  const result = await productsOperations.updateById(contactId, req.body)
  if (!result) {
    throw new NotFound(`Product with id=${contactId} not found`)
  }
  sendSuccessRes(res, { result })
}

const removeContact = async (req, res, next) => {
  const { contactId } = req.params
  const result = await productsOperations.removeContact(contactId)
  if (!result) {
    throw new NotFound(`Product with id=${contactId} not found`)
  }
  sendSuccessRes(res, { message: 'Success delete' })
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateById,
  removeContact,
}
