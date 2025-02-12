import {
  saveJobService,
  getJobsService,
  deleteJobService,
  updateJobService,
} from "../Services/jobs.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const createJobController = (req, res) =>
  handleResponse(saveJobService, req, res);

export const getJobsController = (req, res) =>
  handleResponse(getJobsService, req, res);

export const deleteJobController = (req, res) =>
  handleResponse(deleteJobService, req, res);

export const updateJobController = (req, res) =>
  handleResponse(updateJobService, req, res);
