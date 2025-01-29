import { Router } from "express";
import {
  createAdminUser,
  getAllUsersController,
  loginAdminUser,
} from "../controllers/admin.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter.post("/create-user", createAdminUser);
adminRouter.post("/login", loginAdminUser);
adminRouter.get("/all-users", authenticate, getAllUsersController);

export default adminRouter;
