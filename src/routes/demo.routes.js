import { Router } from "express";
import {
  getDemos,
  handleDemoRequest,
  updateDemoController,
} from "../controllers/demo.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/request", handleDemoRequest);
router.get("/responses", authenticate, getDemos);
router.patch("/update", authenticate, updateDemoController);

export default router;
