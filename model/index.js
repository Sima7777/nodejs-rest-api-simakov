const fs = require('fs/promises')
const path = require('path')
const contactsPath = 'model/contacts.json'
const { v4 } = require('uuid')

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf-8')
  const result = JSON.parse(data)
  if (!result) {
    return null
  }
  return result
}

const stringify = (value) => String(value)

const getContactById = async (contactId) => {
  const contacts = await listContacts()

  const contact = contacts.find(
    (item) => stringify(item.id) === stringify(contactId),
  )
  if (!contact) {
    return null
  }
  return contact
}

const filePath = path.join(__dirname, 'contacts.json')

const updateAllContacts = async (newContacts) => {
  await fs.writeFile(filePath, JSON.stringify(newContacts))
}

const addContact = async (body) => {
  const contacts = await listContacts()
  const newContact = { id: v4(), ...body }
  const newContacts = [...contacts, newContact]
  await updateAllContacts(newContacts)
  return newContact
}

const removeContact = async (contactId) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex(
    (item) => stringify(item.id) === stringify(contactId),
  )
  if (idx === -1) {
    return null
  }
  const newContacts = contacts.filter(
    (item) => stringify(item.id) !== stringify(contactId),
  )
  await updateAllContacts(newContacts)
  return `Контакт с id ${contactId} был успешно удален`
}

const updateById = async (contactId, body) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex(
    (item) => stringify(item.id) === stringify(contactId),
  )
  if (idx === -1) {
    return null
  }
  const contactToUpdate = { ...contacts[idx], ...body }
  contacts[idx] = contactToUpdate
  await updateAllContacts(contacts)
  return contactToUpdate
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateById,
}
