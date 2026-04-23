import { Router, type IRouter } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { CreateInquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/inquiries", async (req, res) => {
  const body = CreateInquiryBody.parse(req.body);
  const [row] = await db
    .insert(inquiriesTable)
    .values({
      carId: body.carId,
      name: body.name,
      phone: body.phone,
      email: body.email ?? null,
      message: body.message,
    })
    .returning();
  res.status(201).json({
    id: row!.id,
    carId: row!.carId,
    name: row!.name,
    phone: row!.phone,
    email: row!.email,
    message: row!.message,
    createdAt: row!.createdAt.toISOString(),
  });
});

export default router;
