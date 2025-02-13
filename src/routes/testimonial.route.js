import { Router } from "express";
import {
  deleteTestimonialController,
  fetchTestimonialController,
  saveTestimonialController,
  updateTestimonialController, // Import the update controller
} from "../controllers/testimonial.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", saveTestimonialController);
router.get("/all", fetchTestimonialController);
router.patch("/update", authenticate, updateTestimonialController); // Update route
router.delete("/delete", authenticate, deleteTestimonialController); // Delete route

export default router;
