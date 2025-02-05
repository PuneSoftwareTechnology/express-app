import { findAll, insert, updateSql } from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveCompanyService = async (payload) => {
  try {
    const requiredFields = ["company_name", "company_logo"];

    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    // Check if the company already exists
    const existingCompanies = await findAll(
      "placement_companies",
      "company_name = ? ",
      [payload.company_name]
    );

    if (existingCompanies.length > 0) {
      return {
        status: 400,
        data: {
          success: false,
          message: "Company already exists. Try to edit it.",
        },
      };
    }

    await insert("placement_companies", payload);

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
    const companies = await findAll("placement_companies", "deleted = 0");

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
    const existingCompanies = await findAll("placement_companies", "id = ?", [
      id,
    ]);

    if (existingCompanies.length === 0) {
      return {
        status: 404,
        data: {
          success: false,
          message: "Company not found.",
        },
      };
    }

    await updateSql("placement_companies", data, `id = ${id}`);

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
    const existingCompanies = await findAll("placement_companies", "id = ?", [
      id,
    ]);

    if (existingCompanies.length === 0) {
      return {
        status: 404,
        data: {
          success: false,
          message: "Company not found.",
        },
      };
    }
    await updateSql("placement_companies", { deleted: true }, `id = ?`, [id]);

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
