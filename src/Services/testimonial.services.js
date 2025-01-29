import { insert } from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveTestimonialService = async (fields) => {
  try {
    const requiredFields = ["name", "course", "star_ratings", "testimonial"];
    const missingFieldsError = checkMissingFields(fields, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    const sanitizedData = {
      name: fields.name.trim(),
      course: fields.course.toUpperCase(),
      star_ratings: parseInt(fields.star_ratings, 10),
      testimonial: fields.testimonial.trim(),
    };
    await insert("testimonials", sanitizedData);

    return {
      status: 200,
      data: { success: true, message: "Testimonial recorded successfully!" },
    };
  } catch (error) {
    console.error("Error in saveTestimonialService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};
