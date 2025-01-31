import {
  deleteTestimonialService,
  getAllTestimonialsService,
  saveTestimonialService,
} from "../Services/testimonial.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const saveTestimonialController = (req, res) =>
  handleResponse(saveTestimonialService, req, res);

export const fetchTestimonialController = (req, res) =>
  handleResponse(getAllTestimonialsService, req, res);

export const deleteTestimonialController = (req, res) =>
  handleResponse(deleteTestimonialService, req, res);
