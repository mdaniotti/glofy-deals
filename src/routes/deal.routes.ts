import express from "express";
import { createDeal } from "../controllers/deal.controller";
const router = express.Router();

// Create a new deal
router.post("/", async (req, res) => {
  try {
    createDeal(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
