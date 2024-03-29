import Joi from "joi";
import { emailRegExp } from "../constant/emailREgExp.js";
import { subscriptionList } from "../constant/subscriptionList.js";

export const registerUserSchema = Joi.object({
  password: Joi.string().required().min(6),
  email: Joi.string().pattern(emailRegExp).required(),
  subscription: Joi.string().valid(...subscriptionList),
});
