import { executeRawQuery, insert } from "../database/dbConnection.js";
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

// Service to fetch all testimonials
export const getAllTestimonialsService = async () => {
  try {
    const testimonials = await executeRawQuery(
      "SELECT * FROM testimonials WHERE deleted = false"
    );
    return {
      status: 200,
      data: {
        success: true,
        message: "Testimonials fetched successfully!",
        data: testimonials,
      },
    };
  } catch (error) {
    console.error("Error in fetching testimonials:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteTestimonialService = async (payload) => {
  try {
    const { id, user_email } = payload;
    const testimonial = await executeRawQuery(
      "SELECT * FROM testimonials WHERE id = ? AND deleted = false",
      [id]
    );

    if (testimonial.length === 0) {
      return sendError(404, "Testimonial not found or already deleted.");
    }
    await executeRawQuery(
      "UPDATE testimonials SET deleted = true, user_email = ? WHERE id = ?",
      [user_email, id]
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Testimonial deleted and user_email updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleting testimonial:", error);
    return sendError(
      500,
      "An internal server error occurred while deleting the testimonial."
    );
  }
};
