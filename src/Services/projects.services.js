import {
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";

import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveProjectService = async (payload) => {
  try {
    const requiredFields = ["name", "description", "related_course"];
    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    await insert("projects", payload);

    return {
      status: 200,
      data: {
        success: true,
        message: "Project recorded successfully!",
      },
    };
  } catch (error) {
    console.error("Error in adding Projects:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const getProjectsService = async (relatedCourse) => {
  try {
    let query = "SELECT * FROM projects WHERE deleted = false";
    if (relatedCourse) {
      query += ` AND related_topic ='${relatedCourse?.relatedCourse}' `;
    }

    const responses = await executeRawQuery(query);

    return {
      status: 200,
      data: {
        success: true,
        message: "Projects fetched successfully!",
        data: responses,
      },
    };
  } catch (error) {
    console.error("Error in getProjectsService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteProjectService = async ({ id }) => {
  try {
    const project = await findAll("projects", "id = ? AND deleted = false", [
      id,
    ]);

    if (project.length === 0) {
      return sendError(
        404,
        "Project does not exist or has already been deleted."
      );
    }
    await updateSql("projects", { deleted: true }, "id = ?", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Project marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteProjectService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const updateProjectService = async (payload) => {
  try {
    const { id, ...data } = payload;

    if (!id) {
      return sendError(400, "Project ID is required.");
    }

    const project = await findAll("projects", "id = ?", [id]);
    if (project.length === 0) {
      return sendError(
        404,
        "Project does not exist or has already been deleted."
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    await updateSql("projects", data, "id = ?", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Project updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error in updateProjectService:", error);
    return sendError(500, "Internal server error.");
  }
};
