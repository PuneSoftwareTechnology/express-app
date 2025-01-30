import { createFAQService, getFAQsService } from "../Services/faq.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const createFAQController = (req, res) =>
  handleResponse(createFAQService, req, res);

export const getFAQController = (req, res) =>
  handleResponse(getFAQsService, req, res);
