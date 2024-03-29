import { User } from "../models/User.js";

export async function findUserServise(data) {
  const user = await User.findOne(data);
  return user;
}

export async function createUserServise(body) {
  const newUser = await User.create(body);
  return newUser;
}
