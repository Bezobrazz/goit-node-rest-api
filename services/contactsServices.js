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

async function updateContactById(id, body) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const updatedContact = { ...contacts[index] };

  Object.keys(body).forEach((key) => {
    updatedContact[key] = body[key];
  });

  contacts[index] = updatedContact;

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");
  console.log(updatedContact);

  return updatedContact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const removedContact = contacts.find((contact) => contact.id === contactId);
  if (!removedContact) return null;

  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  await fs.writeFile(
    contactsPath,
    JSON.stringify(updatedContacts, null, 2),
    "utf-8"
  );
  return removedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
};
