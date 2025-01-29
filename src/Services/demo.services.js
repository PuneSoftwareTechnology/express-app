import { executeRawQuery, insert } from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const processDemoRequest = async (fields) => {
  try {
    const requiredFields = ["name", "email", "phone", "message"];
    const missingFieldsError = checkMissingFields(fields, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    // Sanitize input
    const sanitizedData = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value.trim()])
    );
    sanitizedData.email = sanitizedData.email.toLowerCase();

    // Insert into the database
    await insert("demo_responses", sanitizedData);

    return {
      status: 200,
      data: { success: true, message: "Demo request processed successfully!" },
    };
  } catch (error) {
    console.error("Error in processDemoRequest:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

// Get All Responses Service
export const getAllresponses = async () => {
  try {
    const responses = await executeRawQuery("SELECT * FROM demo_responses");
    return {
      status: 200,
      data: {
        success: true,
        message: "Demo responses fetched successfully!",
        data: responses,
      },
    };
  } catch (error) {
    console.error("Error in fetching data:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};
