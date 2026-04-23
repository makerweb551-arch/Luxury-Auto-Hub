import { Router, type IRouter } from "express";
import healthRouter from "./health";
import carsRouter from "./cars";
import marketplaceRouter from "./marketplace";
import inquiriesRouter from "./inquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(carsRouter);
router.use(marketplaceRouter);
router.use(inquiriesRouter);

export default router;
