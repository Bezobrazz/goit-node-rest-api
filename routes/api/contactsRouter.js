import express from "express";
import contactsControllers from "../../controllers/contactsControllers.js";
import validateBody from "../../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:id", contactsControllers.getById);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactsControllers.add
);

contactsRouter.put(
  "/:id",
  validateBody(updateContactSchema),
  contactsControllers.updateById
);

contactsRouter.patch(
  "/:id/favorite",
  validateBody(updateContactStatusSchema),
  contactsControllers.updateStatusContact
);

contactsRouter.delete("/:id", contactsControllers.removeById);

export default contactsRouter;
