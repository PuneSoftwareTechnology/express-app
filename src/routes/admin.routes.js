import { Router } from "express";
import {
  createAdminUser,
  loginAdminUser,
} from "../controllers/admin.controllers.js";

const adminRouter = Router();

adminRouter.post("/create-user", createAdminUser);
adminRouter.post("/login", loginAdminUser);

export default adminRouter;
