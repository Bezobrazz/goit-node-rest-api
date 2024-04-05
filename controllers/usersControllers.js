import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

import {
  createUserServise,
  findUserServise,
  updateUserServise,
  validatePassword,
} from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const { JWT_SECRET } = process.env;

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserServise({ email });
  if (user) {
    throw HttpError(409, "email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await createUserServise({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUserServise({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparePassword = await validatePassword(password, user.password);

  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "24h" });
  await updateUserServise({ _id: id }, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logoutUser = async (req, res, next) => {
  const { _id: id } = req.user;
  updateUserServise(id, { token: null });

  res.status(204).json({ message: "Logout success" });
};

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  getCurrent: ctrlWrapper(getCurrent),
  logoutUser: ctrlWrapper(logoutUser),
};