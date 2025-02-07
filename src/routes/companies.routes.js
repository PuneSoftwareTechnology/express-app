import { Router } from "express";
import {
  deleteCompanyController,
  editCompanyController,
  getAllCompaniesController,
  saveCompanyController,
} from "../controllers/companies.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const companiesRouter = Router();

companiesRouter.post("/save", authenticate, saveCompanyController);
companiesRouter.get("/all", getAllCompaniesController);
companiesRouter.patch("/edit", authenticate, editCompanyController);
companiesRouter.patch("/delete", authenticate, deleteCompanyController);

export default companiesRouter;
