import { Router } from "express";
import {
  deleteDemoController,
  getDemos,
  handleDemoRequest,
  updateDemoController,
  handleConsultationRequest,
} from "../controllers/demo.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/request", handleDemoRequest);
router.get("/responses", authenticate, getDemos);
router.patch("/update", authenticate, updateDemoController);
router.patch("/delete", authenticate, deleteDemoController);
router.post("/consultation", handleConsultationRequest);

export default router;
