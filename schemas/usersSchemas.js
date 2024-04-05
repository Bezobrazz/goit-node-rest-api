import Joi from "joi";
import { emailRegExp } from "../constant/emailREgExp.js";
import { subscriptionList } from "../constant/subscriptionList.js";

export const registerUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required().min(6),
  subscription: Joi.string().valid(...subscriptionList),
});

export const loginUserShema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().required(),
});
