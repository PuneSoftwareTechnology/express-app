import { Router } from "express";
import { handleDemoRequest } from "../controllers/demo.controllers.js";

const router = Router();

router.post("/request", handleDemoRequest);

export default router;
