import {
  saveProjectService,
  getProjectsService,
  deleteProjectService,
  updateProjectService,
} from "../Services/projects.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const createProjectController = (req, res) =>
  handleResponse(saveProjectService, req, res);

export const getProjectsController = (req, res) =>
  handleResponse(getProjectsService, req, res);

export const deleteProjectController = (req, res) =>
  handleResponse(deleteProjectService, req, res);

export const updateProjectController = (req, res) =>
  handleResponse(updateProjectService, req, res);
