import { saveTestimonialService } from "../Services/testimonial.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const saveTestimonialController = (req, res) =>
  handleResponse(saveTestimonialService, req, res);
