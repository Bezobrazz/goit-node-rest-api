const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
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

async function addContact(name, email, phone) {
  const newContact = {
    id: randomUUID(),
    name,
    email,
    phone,
  };
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");
  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
