import { Request, Response } from "express";
import db from "../db";

export const createDeal = async (req: Request, res: Response) => {
  try {
    const { dealId, rep, carModel, dealAmount, dealDate, status } = req.body;

    if (!dealId || !rep || !carModel || !dealAmount || !dealDate || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const deal = db
      .prepare(
        "INSERT INTO deals (deal_id, rep, car_model, deal_amount, deal_date, status) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(dealId, rep, carModel, dealAmount, dealDate, status);

    res.status(201).json({
      dealId,
      rep,
      carModel,
      dealAmount,
      dealDate,
      status,
      lastInsertRowid: deal.lastInsertRowid,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
