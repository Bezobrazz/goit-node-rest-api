import express from "express";
import validateBody from "../../decorators/validateBody.js";
import {
  registerUserSchema,
  loginUserShema,
} from "../../schemas/usersSchemas.js";
import usersControllers from "../../controllers/usersControllers.js";
import { authenticate } from "../../middlevares/authenticate.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(registerUserSchema),
  usersControllers.registerUser
);

usersRouter.post(
  "/login",
  validateBody(loginUserShema),
  usersControllers.loginUser
);

usersRouter.get("/current", authenticate, usersControllers.getCurrent);

export default usersRouter;
