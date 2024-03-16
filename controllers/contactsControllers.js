import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import contactsServices from "../services/contactsServices.js";

const getAll = async (req, res) => {
  const result = await contactsServices.listContacts();

  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.getContactById(id);

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
};
