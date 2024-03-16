import ctrlWrapper from "../decorators/ctrlWrapper.js";
import contactsServices from "../services/contactsServices.js";

const getAll = async (req, res) => {
  const result = await contactsServices.listContacts();
  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
};
