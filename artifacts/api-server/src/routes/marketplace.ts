import { Router, type IRouter } from "express";
import { db, carsTable } from "@workspace/db";
import { sql, eq, countDistinct } from "drizzle-orm";

const router: IRouter = Router();

router.get("/marketplace/summary", async (_req, res) => {
  const [totals] = await db
    .select({
      totalListings: sql<number>`count(*)::int`,
      averagePriceBhd: sql<number>`COALESCE(AVG(${carsTable.priceBhd})::float, 0)`,
      makes: countDistinct(carsTable.make),
    })
    .from(carsTable);

  const [newCount] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(carsTable)
    .where(eq(carsTable.condition, "new"));

  const [usedCount] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(carsTable)
    .where(eq(carsTable.condition, "used"));

  res.json({
    totalListings: totals?.totalListings ?? 0,
    averagePriceBhd: Number(totals?.averagePriceBhd ?? 0),
    newCount: newCount?.c ?? 0,
    usedCount: usedCount?.c ?? 0,
    makes: totals?.makes ?? 0,
  });
});

router.get("/marketplace/makes", async (_req, res) => {
  const rows = await db
    .select({
      make: carsTable.make,
      count: sql<number>`count(*)::int`,
    })
    .from(carsTable)
    .groupBy(carsTable.make)
    .orderBy(sql`count(*) DESC`);
  res.json(rows);
});

router.get("/marketplace/body-types", async (_req, res) => {
  const rows = await db
    .select({
      bodyType: carsTable.bodyType,
      count: sql<number>`count(*)::int`,
    })
    .from(carsTable)
    .groupBy(carsTable.bodyType)
    .orderBy(sql`count(*) DESC`);
  res.json(rows);
});

export default router;
