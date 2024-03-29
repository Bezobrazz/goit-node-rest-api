import express from "express";
import validateBody from "../../decorators/validateBody.js";
import { registerUserSchema } from "../../schemas/usersSchemas.js";
import usersControllers from "../../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(registerUserSchema),
  usersControllers.registerUser
);

export default usersRouter;
