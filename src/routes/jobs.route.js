import express from "express";
import {
  createJobController,
  getJobsController,
  deleteJobController,
  updateJobController,
} from "../controllers/jobs.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const JobRouter = express.Router();

JobRouter.post("/create", authenticate, createJobController);
JobRouter.get("/all", getJobsController);
JobRouter.patch("/delete", authenticate, deleteJobController);
JobRouter.patch("/update", authenticate, updateJobController);

export default JobRouter;
