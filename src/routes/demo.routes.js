import { Router } from "express";
import {
  getDemos,
  handleDemoRequest,
} from "../controllers/demo.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/request", handleDemoRequest);
router.get("/responses", authenticate, getDemos);

export default router;
