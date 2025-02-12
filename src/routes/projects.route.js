import express from "express";
import {
  createProjectController,
  getProjectsController,
  deleteProjectController,
  updateProjectController,
} from "../controllers/projects.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const ProjectRouter = express.Router();

ProjectRouter.post("/create", authenticate, createProjectController);
ProjectRouter.get("/all", getProjectsController);
ProjectRouter.patch("/delete", authenticate, deleteProjectController);
ProjectRouter.patch("/update", authenticate, updateProjectController);

export default ProjectRouter;
