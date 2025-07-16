import { Request, Response } from "express";
import db from "../db";

// Create a new commission
export const createCommission = async (req: Request, res: Response) => {
  try {
    const {
      commissionId,
      dealId,
      rep,
      commissionAmount,
      commissionPercentage,
      commissionDate,
    } = req.body;

    if (
      !commissionId ||
      !dealId ||
      !rep ||
      !commissionAmount ||
      !commissionPercentage ||
      !commissionDate
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const commission = db
      .prepare(
        "INSERT INTO commissions (commission_id, deal_id, rep, commission_amount, commission_percentage, commission_date) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(
        commissionId,
        dealId,
        rep,
        commissionAmount,
        commissionPercentage,
        commissionDate
      );

    res.status(201).json({
      commissionId,
      dealId,
      rep,
      commissionAmount,
      commissionPercentage,
      commissionDate,
      lastInsertRowid: commission.lastInsertRowid,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all commissions
export const getCommissions = async (req: Request, res: Response) => {
  try {
    const commissions = db.prepare("SELECT * FROM commissions").all();
    res.status(200).json({ commissions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all commissions by dealId
export const getCommissionsByDealId = async (req: Request, res: Response) => {
  try {
    const { dealId } = req.params;
    console.log("dealId", dealId);
    const commissions = db
      .prepare("SELECT * FROM commissions WHERE deal_id = ?")
      .all(dealId);
    res.status(200).json({ commissions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all commission by rep
export const getCommissionsByRep = async (req: Request, res: Response) => {
  try {
    const { rep } = req.params;
    const { commissionDate } = req.query;

    // Normalizar el parámetro: remover espacios y convertir a minúsculas
    const normalizedRep = rep.replace(/\s+/g, "").toLowerCase();

    let query =
      "SELECT * FROM commissions WHERE LOWER(REPLACE(rep, ' ', '')) LIKE ?";
    let params = [`%${normalizedRep}%`];

    if (commissionDate) {
      query += " AND commission_date = ?";
      params.push(commissionDate as string);
    }

    const commissions = db.prepare(query).all(...params);
    res.status(200).json({ commissions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get monthly commission total
export const getMonthlyCommissionTotal = async (
  req: Request,
  res: Response
) => {
  try {
    const { month } = req.params;
    const { year } = req.query;

    // Validar que el mes esté entre 1-12
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: "Month must be between 1 and 12" });
    }

    // Usar año actual si no se proporciona
    const currentYear = new Date().getFullYear();
    const targetYear = year ? parseInt(year as string) : currentYear;

    // Formatear mes con cero inicial si es necesario
    const formattedMonth = monthNum.toString().padStart(2, "0");

    const query = `
      SELECT 
        SUM(commission_amount) as total_amount,
        COUNT(*) as total_commissions
      FROM commissions 
      WHERE strftime('%Y-%m', commission_date) = ?
    `;

    const result = db.prepare(query).get(`${targetYear}-${formattedMonth}`) as {
      total_amount: number | null;
      total_commissions: number | null;
    };

    res.status(200).json({
      month: monthNum,
      year: targetYear,
      totalAmount: result.total_amount || 0,
      totalCommissions: result.total_commissions || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
