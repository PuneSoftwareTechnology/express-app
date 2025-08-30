import {
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveTestimonialService = async (payload) => {
  try {
    const requiredFields = ["name", "star_rating", "testimonial"];
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

export const getAllTestimonialsService = async (category) => {
  try {
    let query = "SELECT * FROM testimonials WHERE deleted = false";
    const params = [];

    if (category?.category_id) {
      query += " AND category_id = $1";
      params.push(category.category_id);
    }

    query += " ORDER BY updated_at DESC"; // Ensure proper spacing and placement

    if (!category?.backend) {
      query += " LIMIT 12";
    }
    const testimonials = await executeRawQuery(query, params);

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
      500,
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteTestimonialService = async ({ id }) => {
  try {
    const testimonial = await findAll(
      "testimonials",
      "id = $1 AND deleted = false",
      [id]
    );

    if (testimonial.length === 0) {
      return sendError(
        404,
        "Testimonial does not exist or has already been deleted."
      );
    }
    await updateSql("testimonials", { deleted: true }, "id = $1", [id]);

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

    const testimonial = await findAll("testimonials", "id = $1", [id]);
    if (testimonial.length === 0) {
      return sendError(
        404,
        "Testimonial does not exist or has already been deleted."
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    await updateSql("testimonials", data, "id = $1", [id]);

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
