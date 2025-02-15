import {
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const createFAQService = async (fields) => {
  try {
    // Check for missing required fields
    const requiredFields = [
      "question",
      "answer",
      "related_topic",
      "user_email",
      "category_id",
      "course_id",
    ];
    const missingFieldsError = checkMissingFields(fields, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    // Insert the FAQ into the database
    await insert("faqs", fields);

    return {
      status: 200,
      data: {
        success: true,
        message: "FAQ recorded successfully!",
      },
    };
  } catch (error) {
    console.error("Error in createFAQService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const getFAQsService = async (course) => {
  try {
    let query = "SELECT * FROM faqs WHERE deleted = false";
    if (course) {
      query += ` AND course_id ='${course?.course_id}' `;
    }

    const responses = await executeRawQuery(query);

    return {
      status: 200,
      data: {
        success: true,
        message: "FAQs fetched successfully!",
        data: responses,
      },
    };
  } catch (error) {
    console.error("Error in getFAQsService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteFAQService = async ({ id }) => {
  try {
    const faq = await findAll("faqs", "id  = $1 AND deleted = false", [id]);

    if (faq.length === 0) {
      return sendError(404, "FAQ does not exist or has already been deleted.");
    }
    await updateSql("faqs", { deleted: true }, "id  = $1", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "FAQ marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteFAQService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const updateFAQService = async (payload) => {
  try {
    const { id, ...data } = payload;

    const faq = await findAll("faqs", "id  = $1", [id]);
    if (faq.length === 0) {
      return sendError(404, "FAQ does not exist or has already been deleted.");
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    await updateSql("faqs", data, "id  = $1", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "FAQ updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error in updateFAQService:", error);
    return sendError(500, "Internal server error.");
  }
};
