import fs from "fs";
import csv from "csv-parser";
import db from "../db";
import { v4 as uuidv4 } from "uuid";

interface DealRow {
  deal_id: string;
  rep: string;
  car_model: string;
  deal_amount: string;
  deal_date: string;
  status: string;
}

interface ProcessedDeal {
  deal_id: string;
  rep: string;
  car_model: string;
  deal_amount: number;
  deal_date: string;
  status: string;
}

const calculateCommission = (
  deal: ProcessedDeal
): {
  commission_amount: number;
  commission_percentage: number;
} => {
  // Solo se pagan comisiones si el deal está completado
  if (deal.status.toLowerCase() !== "completed") {
    return { commission_amount: 0, commission_percentage: 0 };
  }

  let commission_percentage = 5; // Comisión base: 5%

  // Bono del +1% si el monto del deal es mayor a $20,000
  if (deal.deal_amount > 20000) {
    commission_percentage += 1;
  }

  // Penalización del 0.5% si la fecha del deal es anterior al mes actual
  const dealDate = new Date(deal.deal_date);
  const currentDate = new Date();
  const currentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  if (dealDate < currentMonth) {
    commission_percentage -= 0.5;
  }

  const commission_amount = (deal.deal_amount * commission_percentage) / 100;

  return { commission_amount, commission_percentage };
};

const importDealsFromCSV = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const deals: ProcessedDeal[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: DealRow) => {
        deals.push({
          deal_id: row.deal_id,
          rep: row.rep,
          car_model: row.car_model,
          deal_amount: parseFloat(row.deal_amount),
          deal_date: row.deal_date,
          status: row.status,
        });
      })
      .on("end", () => {
        console.log(`CSV procesado. ${deals.length} deals encontrados.`);

        // Procesar deals con transacciones
        const transaction = db.transaction(() => {
          let processedCount = 0;
          let commissionCount = 0;
          let duplicateCount = 0;

          for (const deal of deals) {
            try {
              // Insertar deal usando INSERT OR IGNORE para manejar duplicados
              const dealResult = db
                .prepare(
                  "INSERT OR IGNORE INTO deals (deal_id, rep, car_model, deal_amount, deal_date, status) VALUES (?, ?, ?, ?, ?, ?)"
                )
                .run(
                  deal.deal_id,
                  deal.rep,
                  deal.car_model,
                  deal.deal_amount,
                  deal.deal_date,
                  deal.status
                );

              // Si no se insertó (duplicado), continuar al siguiente
              if (dealResult.changes === 0) {
                duplicateCount++;
                console.log(
                  `⚠️  Deal duplicado ignorado: ${deal.rep} - ${deal.car_model} (ID: ${deal.deal_id})`
                );
                continue;
              }

              processedCount++;

              // Calcular y crear comisión si corresponde
              const { commission_amount, commission_percentage } =
                calculateCommission(deal);

              if (commission_amount > 0) {
                db.prepare(
                  "INSERT INTO commissions (commission_id, deal_id, rep, commission_amount, commission_percentage, commission_date) VALUES (?, ?, ?, ?, ?, ?)"
                ).run(
                  uuidv4(),
                  deal.deal_id,
                  deal.rep,
                  commission_amount,
                  commission_percentage,
                  deal.deal_date
                );
                commissionCount++;
              }

              console.log(
                `Deal procesado: ${deal.rep} - ${deal.car_model} - $${deal.deal_amount} - ${deal.status}`
              );
              if (commission_amount > 0) {
                console.log(
                  `  Comisión creada: $${commission_amount} (${commission_percentage}%)`
                );
              }
            } catch (error) {
              console.error(
                `Error procesando deal: ${deal.rep} - ${deal.car_model}`,
                error
              );
              throw error; // Esto hará rollback de toda la transacción
            }
          }

          console.log(`\nResumen:`);
          console.log(`- Deals procesados: ${processedCount}`);
          console.log(`- Deals duplicados ignorados: ${duplicateCount}`);
          console.log(`- Comisiones creadas: ${commissionCount}`);
        });

        try {
          transaction();
          console.log("\n✅ Importación completada exitosamente");
          resolve();
        } catch (error) {
          console.error("\n❌ Error durante la importación:", error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("Error leyendo el archivo CSV:", error);
        reject(error);
      });
  });
};

// Función principal
const main = async () => {
  const csvFilePath = process.argv[2];

  if (!csvFilePath) {
    console.error("Uso: npm run import-deals <ruta-del-archivo-csv>");
    console.error("Ejemplo: npm run import-deals ./data/deals.csv");
    process.exit(1);
  }

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ El archivo ${csvFilePath} no existe`);
    process.exit(1);
  }

  try {
    await importDealsFromCSV(csvFilePath);
  } catch (error) {
    console.error("Error en la importación:", error);
    process.exit(1);
  }
};

// Ejecutar si es el archivo principal
if (process.argv[1].includes("import-deals")) {
  main();
}

export { calculateCommission };
