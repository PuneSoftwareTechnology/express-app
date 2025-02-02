import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  deleteNotificationEmailController,
  getAllActiveNotificationsController,
  saveNotificationEmailController,
} from "../controllers/settings.controllers.js";

const settingsRouter = Router();

settingsRouter.post(
  "/save-emails",
  authenticate,
  saveNotificationEmailController
);
settingsRouter.get(
  "/all-emails",
  authenticate,
  getAllActiveNotificationsController
);

settingsRouter.patch(
  "/delete-emails",
  authenticate,
  deleteNotificationEmailController
);

export default settingsRouter;
