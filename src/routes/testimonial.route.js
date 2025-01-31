import { Router } from "express";
import {
  deleteTestimonialController,
  fetchTestimonialController,
  saveTestimonialController,
} from "../controllers/testimonial.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", saveTestimonialController);
router.get("/all", fetchTestimonialController);
router.patch("/update", authenticate, deleteTestimonialController);

export default router;
