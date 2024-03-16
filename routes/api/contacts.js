import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(["success"]);
});
router.get("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});
router.post("/", (req, res) => {});
router.put("/:id", (req, res) => {});

export default router;
