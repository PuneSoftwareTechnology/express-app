import { executeRawQuery, insert } from "../database/dbConnection.js";
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
    let query = "SELECT * FROM faqs";
    if (relatedTopic) {
      query += ` WHERE related_topic ='${relatedTopic?.related_topic}' `;
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
