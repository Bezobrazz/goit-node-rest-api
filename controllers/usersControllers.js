import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { randomUUID } from "crypto";

import {
  createUserServise,
  findUserServise,
  updateUserServise,
  validatePassword,
} from "../services/usersServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

import Jimp from "jimp";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await findUserServise({ email });
  if (user) {
    throw HttpError(409, "email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = randomUUID();

  const newUser = await createUserServise({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href='${BASE_URL}/api/users/verify/${newUser.verificationToken}'>Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await findUserServise({ verificationToken });

  if (!user) {
    throw HttpError(401, "User not found");
  }

  await updateUserServise(user._id, { verify: true, verificationToken: null });

  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await findUserServise({ email });

  if (!user) {
    throw HttpError(401, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href='${BASE_URL}/api/users/verify/${user.verificationToken}'>Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verify email send success" });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUserServise({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(403, "Email not verify");
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

//update avatar
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const avatarsDir = path.join(__dirname, "..", "..", "public", "avatars");

export const updateAvatar = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { path: tmpUpload, originalname } = req.file;

  const extention = originalname.split(".").pop();
  const filename = `${userId}.${extention}`;

  const resultUpload = path.join(avatarsDir, filename);

  const jimpFile = await Jimp.read(tmpUpload);
  jimpFile.resize(250, 250).write(resultUpload);

  const avatarURL = path.join("avatars", filename);

  await updateUserServise(userId, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  registerUser: ctrlWrapper(registerUser),
  loginUser: ctrlWrapper(loginUser),
  getCurrent: ctrlWrapper(getCurrent),
  logoutUser: ctrlWrapper(logoutUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
