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
    const requiredFields = ["question", "answer", "related_topic"];
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

export const getFAQsService = async (relatedTopic) => {
  try {
    let query = "SELECT * FROM faqs WHERE deleted = false";
    if (relatedTopic) {
      query += ` AND related_topic ='${relatedTopic?.related_topic}' `;
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
    const faq = await findAll("faqs", "id = ? AND deleted = false", [id]);

    if (faq.length === 0) {
      return sendError(404, "FAQ does not exist or has already been deleted.");
    }
    await updateSql("faqs", { deleted: true }, "id = ?", [id]);

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

    const faq = await findAll("faqs", "id = ?", [id]);
    if (faq.length === 0) {
      return sendError(404, "FAQ does not exist or has already been deleted.");
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    await updateSql("faqs", data, "id = ?", [id]);

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
