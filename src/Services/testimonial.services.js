import {
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveTestimonialService = async (payload) => {
  try {
    const requiredFields = ["name", "message", "designation"];
    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    await insert("testimonials", payload);

    return {
      status: 200,
      data: {
        success: true,
        message: "Testimonial recorded successfully!",
      },
    };
  } catch (error) {
    console.error("Error in saveTestimonialService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const getAllTestimonialsService = async () => {
  try {
    const testimonials = await findAll("testimonials", "deleted = false");

    return {
      status: 200,
      data: {
        success: true,
        message: "Testimonials fetched successfully!",
        data: testimonials,
      },
    };
  } catch (error) {
    console.error("Error in getAllTestimonialsService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteTestimonialService = async ({ id }) => {
  try {
    const testimonial = await findAll(
      "testimonials",
      "id = ? AND deleted = false",
      [id]
    );

    if (testimonial.length === 0) {
      return sendError(
        404,
        "Testimonial does not exist or has already been deleted."
      );
    }
    await updateSql("testimonials", { deleted: true }, "id = ?", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Testimonial marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteTestimonialService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const updateTestimonialService = async (payload) => {
  try {
    const { id, ...data } = payload;

    if (!id) {
      return sendError(400, "Testimonial ID is required.");
    }

    const testimonial = await findAll("testimonials", "id = ?", [id]);
    if (testimonial.length === 0) {
      return sendError(
        404,
        "Testimonial does not exist or has already been deleted."
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    await updateSql("testimonials", data, "id = ?", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Testimonial updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error in updateTestimonialService:", error);
    return sendError(500, "Internal server error.");
  }
};
