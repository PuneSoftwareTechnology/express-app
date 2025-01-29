import {
  getAllresponses,
  processDemoRequest,
} from "../Services/demo.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const handleDemoRequest = (req, res) =>
  handleResponse(processDemoRequest, req, res);

// Get Demos
export const getDemos = (req, res) => handleResponse(getAllresponses, req, res);
