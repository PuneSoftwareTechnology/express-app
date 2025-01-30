import { Router } from "express";
import {
  createAdminUser,
  deleteUserController,
  getAllUsersController,
  loginAdminUser,
} from "../controllers/admin.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter.post("/create-user", authenticate, createAdminUser);
adminRouter.post("/login", loginAdminUser);
adminRouter.get("/all-users", authenticate, getAllUsersController);
adminRouter.patch("/delete-user", authenticate, deleteUserController);

export default adminRouter;
