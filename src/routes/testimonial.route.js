import { Router } from "express";
import { saveTestimonialController } from "../controllers/testimonial.controller.js";

const router = Router();

router.post("/create", saveTestimonialController);

export default router;
