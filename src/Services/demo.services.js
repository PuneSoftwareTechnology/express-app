import {
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const processDemoRequest = async (fields) => {
  try {

    // Sanitize input
    const sanitizedData = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value.trim()])
    );
    sanitizedData.email = sanitizedData.email.toLowerCase();

    // Insert into the database
    await insert("demos", sanitizedData);

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
    const responses = await executeRawQuery(
      "SELECT * FROM demos WHERE deleted = false  order by updated_at desc"
    );
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

export const updateDemoService = async (payload) => {
  try {
    const { id, ...data } = payload;
    const demo = await findAll("demos", "id  = $1", [id]);
    if (demo.length === 0) {
      return sendError(
        404,
        "Demo request does not exist or has already been deleted."
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    await updateSql("demos", data, "id  = $1", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Demo request updated successfully!",
      },
    };
  } catch (error) {
    console.error("Error in updateDemoService:", error);
    return sendError(
      500,
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteDemoService = async ({ id }) => {
  try {
    const demo = await findAll("demos", "id  = $1 AND deleted = false", [id]);

    if (demo.length === 0) {
      return sendError(404, "Demo does not exist or has already been deleted.");
    }
    await updateSql("demos", { deleted: true }, "id  = $1", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Demo marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteDemoService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const processConsultationRequest = async (fields) => {
  try {
    const requiredFields = ["name", "phone_number"];
    const missingFieldsError = checkMissingFields(fields, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    // Insert into the database
    await insert("consultation", fields);

    return {
      status: 200,
      data: {
        success: true,
        message: "Consultation request processed successfully!",
      },
    };
  } catch (error) {
    console.error("Error in processConsultationRequest:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const getAllConsultationsService = async () => {
  try {
    const consultations = await executeRawQuery(
      "SELECT * FROM consultation WHERE deleted = false ORDER BY created_at DESC"
    );
    return {
      status: 200,
      data: {
        success: true,
        message: "Consultations fetched successfully!",
        data: consultations,
      },
    };
  } catch (error) {
    console.error("Error in fetching consultations:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteConsultationService = async ({ id }) => {
  try {
    const consultation = await findAll(
      "consultation",
      "id = $1 AND deleted = false",
      [id]
    );

    if (consultation.length === 0) {
      return sendError(
        404,
        "Consultation does not exist or has already been deleted."
      );
    }
    await updateSql("consultation", { deleted: true }, "id = $1", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Consultation marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteConsultationService:", error);
    return sendError(500, "Internal server error.");
  }
};
