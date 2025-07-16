import express from "express";
import commissionRouter from "./commission.routes";
import dealRouter from "./deal.routes";

const router = express.Router();

router.use("/commissions", commissionRouter);
router.use("/deals", dealRouter);

export default router;
