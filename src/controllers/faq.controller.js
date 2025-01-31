import {
  createFAQService,
  deleteFAQService,
  getFAQsService,
  updateFAQService,
} from "../Services/faq.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const createFAQController = (req, res) =>
  handleResponse(createFAQService, req, res);

export const getFAQController = (req, res) =>
  handleResponse(getFAQsService, req, res);

export const deleteFAQController = (req, res) =>
  handleResponse(deleteFAQService, req, res);

export const updateFAQController = (req, res) =>
  handleResponse(updateFAQService, req, res);
