import { Contact } from "../models/Contact.js";

async function listContacts() {
  const data = await Contact.find({});
  return data;
}

async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}

async function addContact(body) {
  const newContact = await Contact.create(body);
  return newContact;
}

async function updateContactById(id, data) {
  const contact = await Contact.findByIdAndUpdate(id, data, { new: true });
  return contact;
}

async function removeContact(contactId) {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
};
