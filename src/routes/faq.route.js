import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createFAQController,
  getFAQController,
} from "../controllers/faq.controller.js";

const faqRouter = Router();

faqRouter.post("/create", authenticate, createFAQController);
faqRouter.get("/all", getFAQController);

export default faqRouter;
