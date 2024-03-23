import { Contact } from "../models/Contact.js";

async function listContacts() {
  const data = await Contact.find({});
  return data;
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    return null;
  }
}

async function addContact(body) {
  const newContact = await Contact.create(body);
  return newContact;
}

async function updateContactById(id, data) {
  try {
    const contact = await Contact.findByIdAndUpdate(id, data, { new: true });
    return contact;
  } catch (error) {
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
  } catch (error) {
    return null;
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
};
