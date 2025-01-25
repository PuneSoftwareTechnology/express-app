import { Router } from "express";
import { handleDemoRequest } from "../controllers/demoRequests.js";

const router = Router();

router.post("/request", handleDemoRequest);

export default router;
