import { findAll, insert, updateSql } from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveCompanyService = async (payload) => {
  try {
    const requiredFields = ["name", "logo_url"];

    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    // Check if the company already exists
    const existingCompanies = await findAll("companies", "name  = $1 ", [
      payload.name,
    ]);

    if (existingCompanies.length > 0) {
      return {
        status: 400,
        data: {
          success: false,
          message: "Company already exists. Try to edit it.",
        },
      };
    }

    await insert("companies", payload);

    return {
      status: 200,
      data: {
        success: true,
        message: "Company saved successfully.",
      },
    };
  } catch (error) {
    console.error("Error in saveCompanyService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const getAllCompaniesService = async () => {
  try {
    const companies = await findAll("companies", "deleted = false");

    return {
      status: 200,
      data: {
        success: true,
        message: "Companies fetched successfully.",
        data: companies,
      },
    };
  } catch (error) {
    console.error("Error in getAllCompaniesService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const editCompanyService = async (payload) => {
  try {
    const { id, ...data } = payload;

    // Ensure ID is a valid string
    if (!id || typeof id !== "string") {
      throw new Error("Invalid ID format");
    }

    // Use a parameterized query to prevent SQL errors
    const existingCompanies = await findAll("companies", "id = $1", [id]);

    if (existingCompanies.length === 0) {
      return {
        status: 404,
        data: {
          success: false,
          message: "Company not found.",
        },
      };
    }

    // Fix update query to use parameterized ID
    await updateSql("companies", data, "id = $1", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Company updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error in editCompanyService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const deleteCompanyService = async ({ id }) => {
  try {
    const existingCompanies = await findAll("companies", "id  = $1", [id]);

    if (existingCompanies.length === 0) {
      return {
        status: 404,
        data: {
          success: false,
          message: "Company not found.",
        },
      };
    }
    await updateSql("companies", { deleted: true }, `id  = $1`, [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Company deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteCompanyService:", error);
    return sendError(500, "Internal server error.");
  }
};
