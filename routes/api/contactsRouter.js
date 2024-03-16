import express from "express";
import contactsControllers from "../../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAll);
contactsRouter.get("/:id", (req, res) => {});
contactsRouter.delete("/:id", (req, res) => {});
contactsRouter.post("/", (req, res) => {});
contactsRouter.put("/:id", (req, res) => {});

export default contactsRouter;
