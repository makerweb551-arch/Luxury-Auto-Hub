import { Router, type IRouter } from "express";
import { db, carsTable, type Car as DbCar } from "@workspace/db";
import { and, asc, desc, eq, gte, lte, sql, ilike, or, ne } from "drizzle-orm";
import {
  ListCarsQueryParams,
  CreateCarBody,
  GetCarParams,
  GetSimilarCarsParams,
  GetRecentCarsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(c: DbCar) {
  return {
    id: c.id,
    make: c.make,
    model: c.model,
    trim: c.trim,
    year: c.year,
    priceBhd: Number(c.priceBhd),
    mileageKm: c.mileageKm,
    fuel: c.fuel,
    transmission: c.transmission,
    bodyType: c.bodyType,
    color: c.color,
    condition: c.condition,
    location: c.location,
    sellerName: c.sellerName,
    sellerPhone: c.sellerPhone,
    description: c.description,
    images: c.images ?? [],
    featured: c.featured,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/cars/featured", async (_req, res) => {
  const rows = await db
    .select()
    .from(carsTable)
    .where(eq(carsTable.featured, true))
    .orderBy(desc(carsTable.createdAt))
    .limit(8);
  res.json(rows.map(serialize));
});

router.get("/cars/recent", async (req, res) => {
  const params = GetRecentCarsQueryParams.parse(req.query);
  const limit = params.limit ?? 8;
  const rows = await db
    .select()
    .from(carsTable)
    .orderBy(desc(carsTable.createdAt))
    .limit(limit);
  res.json(rows.map(serialize));
});

router.get("/cars", async (req, res) => {
  const p = ListCarsQueryParams.parse(req.query);
  const conds = [] as ReturnType<typeof eq>[];
  if (p.q) {
    const q = `%${p.q}%`;
    const orExpr = or(
      ilike(carsTable.make, q),
      ilike(carsTable.model, q),
      ilike(carsTable.description, q),
    );
    if (orExpr) conds.push(orExpr as never);
  }
  if (p.make) conds.push(eq(carsTable.make, p.make));
  if (p.bodyType) conds.push(eq(carsTable.bodyType, p.bodyType));
  if (p.fuel) conds.push(eq(carsTable.fuel, p.fuel));
  if (p.transmission) conds.push(eq(carsTable.transmission, p.transmission));
  if (p.condition) conds.push(eq(carsTable.condition, p.condition));
  if (p.minPrice !== undefined)
    conds.push(gte(carsTable.priceBhd, String(p.minPrice)) as never);
  if (p.maxPrice !== undefined)
    conds.push(lte(carsTable.priceBhd, String(p.maxPrice)) as never);
  if (p.minYear !== undefined) conds.push(gte(carsTable.year, p.minYear));
  if (p.maxYear !== undefined) conds.push(lte(carsTable.year, p.maxYear));

  const where = conds.length ? and(...conds) : undefined;

  let order;
  switch (p.sort) {
    case "price_asc":
      order = asc(carsTable.priceBhd);
      break;
    case "price_desc":
      order = desc(carsTable.priceBhd);
      break;
    case "year_desc":
      order = desc(carsTable.year);
      break;
    case "mileage_asc":
      order = asc(carsTable.mileageKm);
      break;
    default:
      order = desc(carsTable.createdAt);
  }

  const limit = p.limit ?? 24;
  const offset = p.offset ?? 0;

  const rows = await db
    .select()
    .from(carsTable)
    .where(where)
    .orderBy(order)
    .limit(limit)
    .offset(offset);

  const totalRows = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(carsTable)
    .where(where);

  res.json({
    items: rows.map(serialize),
    total: totalRows[0]?.c ?? 0,
  });
});

router.post("/cars", async (req, res) => {
  const body = CreateCarBody.parse(req.body);
  const inserted = await db
    .insert(carsTable)
    .values({
      ...body,
      priceBhd: String(body.priceBhd),
      featured: false,
    })
    .returning();
  res.status(201).json(serialize(inserted[0]!));
});

router.get("/cars/:id", async (req, res) => {
  const { id } = GetCarParams.parse(req.params);
  const rows = await db
    .select()
    .from(carsTable)
    .where(eq(carsTable.id, id))
    .limit(1);
  if (!rows.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(serialize(rows[0]!));
});

router.get("/cars/:id/similar", async (req, res) => {
  const { id } = GetSimilarCarsParams.parse(req.params);
  const baseRows = await db
    .select()
    .from(carsTable)
    .where(eq(carsTable.id, id))
    .limit(1);
  if (!baseRows.length) {
    res.json([]);
    return;
  }
  const base = baseRows[0]!;
  const rows = await db
    .select()
    .from(carsTable)
    .where(
      and(
        ne(carsTable.id, id),
        or(
          eq(carsTable.make, base.make),
          eq(carsTable.bodyType, base.bodyType),
        )!,
      ),
    )
    .orderBy(desc(carsTable.featured), desc(carsTable.createdAt))
    .limit(6);
  res.json(rows.map(serialize));
});

export default router;
