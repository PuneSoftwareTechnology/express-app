import { Router } from "express";
import {
  deleteTestimonialController,
  fetchTestimonialController,
  saveTestimonialController,
  updateTestimonialController,
} from "../controllers/testimonial.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", saveTestimonialController);
router.get("/all", fetchTestimonialController);
router.patch("/update", authenticate, updateTestimonialController);
router.patch("/delete", authenticate, deleteTestimonialController);

export default router;
