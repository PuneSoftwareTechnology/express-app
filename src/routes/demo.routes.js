import { Router } from "express";
import {
  deleteDemoController,
  getDemos,
  handleDemoRequest,
  updateDemoController,
  handleConsultationRequest,
  deleteConsultationController,
  getAllConsultations,
} from "../controllers/demo.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/request", handleDemoRequest);
router.get("/responses", authenticate, getDemos);
router.patch("/update", authenticate, updateDemoController);
router.patch("/delete", authenticate, deleteDemoController);
router.post("/consultation", handleConsultationRequest);
router.get("/consultations", authenticate, getAllConsultations);
router.patch(
  "/consultation/delete",
  authenticate,
  deleteConsultationController
);

export default router;
