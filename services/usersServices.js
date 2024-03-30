import bcrypt from "bcrypt";
import { User } from "../models/User.js";

export async function findUserServise(data) {
  const user = await User.findOne(data);
  return user;
}

export async function createUserServise(body) {
  const newUser = await User.create(body);
  return newUser;
}

export async function updateUserServise(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true });
}

export async function validatePassword(password, hashPassword) {
  return bcrypt.compare(password, hashPassword);
}
