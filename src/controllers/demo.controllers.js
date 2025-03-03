import {
  deleteDemoService,
  getAllresponses,
  processDemoRequest,
  updateDemoService,
  processConsultationRequest,
  deleteConsultationService,
  getAllConsultationsService,
} from "../Services/demo.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const handleDemoRequest = (req, res) =>
  handleResponse(processDemoRequest, req, res);

// Get Demos
export const getDemos = (req, res) => handleResponse(getAllresponses, req, res);

export const updateDemoController = (req, res) => {
  handleResponse(updateDemoService, req, res);
};

export const deleteDemoController = (req, res) => {
  handleResponse(deleteDemoService, req, res);
};

export const handleConsultationRequest = (req, res) =>
  handleResponse(processConsultationRequest, req, res);

export const getAllConsultations = (req, res) =>
  handleResponse(getAllConsultationsService, req, res);

export const deleteConsultationController = (req, res) =>
  handleResponse(deleteConsultationService, req, res);
