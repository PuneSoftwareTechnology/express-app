import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createFAQController,
  deleteFAQController,
  getFAQController,
  updateFAQController,
} from "../controllers/faq.controller.js";

const faqRouter = Router();

faqRouter.post("/create", authenticate, createFAQController);
faqRouter.get("/all", getFAQController);
faqRouter.patch("/delete", authenticate, deleteFAQController);
faqRouter.patch("/update", authenticate, updateFAQController);

export default faqRouter;
