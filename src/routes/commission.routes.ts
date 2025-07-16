import express from "express";
import {
  createCommission,
  getCommissions,
  getCommissionsByDealId,
  getCommissionsByRep,
  getMonthlyCommissionTotal,
} from "../controllers/commission.controller";

const router = express.Router();

// Get all commissions
router.get("/", async (req, res) => {
  try {
    getCommissions(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all commissions by dealId
router.get("/deals/:dealId", async (req, res) => {
  try {
    getCommissionsByDealId(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all commissions by rep
router.get("/reps/:rep", async (req, res) => {
  try {
    getCommissionsByRep(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly commission total
router.get("/total/:month", async (req, res) => {
  try {
    getMonthlyCommissionTotal(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new commission
router.post("/", async (req, res) => {
  try {
    createCommission(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
