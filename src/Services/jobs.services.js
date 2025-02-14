import {
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveJobService = async (payload) => {
  try {
    const requiredFields = ["name", "description", "related_course"];
    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    await insert("jobs", payload);

    return {
      status: 200,
      data: {
        success: true,
        message: "Job recorded successfully!",
      },
    };
  } catch (error) {
    console.error("Error in adding Job:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const getJobsService = async (related_course) => {
  try {
    let query = "SELECT * FROM jobs WHERE deleted = false";
    if (related_course) {
      query += ` AND related_course  = $1`;
    }

    const responses = await executeRawQuery(
      query,
      related_course ? [related_course] : []
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Jobs fetched successfully!",
        data: responses,
      },
    };
  } catch (error) {
    console.error("Error in getJobsService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteJobService = async ({ id }) => {
  try {
    const job = await findAll("jobs", "id  = $1 AND deleted = false", [id]);

    if (job.length === 0) {
      return sendError(404, "Job does not exist or has already been deleted.");
    }
    await updateSql("jobs", { deleted: true }, "id  = $1", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Job marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteJobService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const updateJobService = async (payload) => {
  try {
    const { id, ...data } = payload;

    if (!id) {
      return sendError(400, "Job ID is required.");
    }

    const job = await findAll("jobs", "id  = $1", [id]);
    if (job.length === 0) {
      return sendError(404, "Job does not exist or has already been deleted.");
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    await updateSql("jobs", data, "id  = $1", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Job updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error in updateJobService:", error);
    return sendError(500, "Internal server error.");
  }
};
