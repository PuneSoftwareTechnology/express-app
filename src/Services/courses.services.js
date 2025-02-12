import {
  bulkInsert,
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveCourseService = async (payload) => {
  console.log(payload);

  try {
    const requiredFields = [
      "name",
      "intro",
      "featured_image",
      "description",
      "training_procedure",
      "slug",
      "module_heading",
      "modules",
      "prerequisite",
      "related_courses",
      "category",
    ];
    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    const processedPayload = {
      ...payload,
      modules: JSON.stringify(payload.modules || []),
      prerequisite: JSON.stringify(payload.prerequisite || []),
      related_courses: JSON.stringify(payload.related_courses || []),
    };

    await insert("courses", processedPayload);

    return {
      status: 200,
      data: {
        success: true,
        message: "Course recorded successfully!",
      },
    };
  } catch (error) {
    console.error("Error in adding Course:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const getCoursesService = async (category) => {
  try {
    let query = "SELECT * FROM courses WHERE deleted = false";
    if (category) {
      query += ` AND category = ?`;
    }

    const responses = await executeRawQuery(
      query,
      category ? [category?.category] : []
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Courses fetched successfully!",
        data: responses,
      },
    };
  } catch (error) {
    console.error("Error in getCoursesService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteCourseService = async ({ id }) => {
  try {
    const course = await findAll("courses", "id = ? AND deleted = false", [id]);

    if (course.length === 0) {
      return sendError(
        404,
        "Course does not exist or has already been deleted."
      );
    }
    await updateSql("courses", { deleted: true }, "id = ?", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Course marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteCourseService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const updateCourseService = async (payload) => {
  try {
    const { id, ...data } = payload;

    if (!id) {
      return sendError(400, "Course ID is required.");
    }

    const course = await findAll("courses", "id = ?", [id]);
    if (course.length === 0) {
      return sendError(
        404,
        "Course does not exist or has already been deleted."
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    // Process fields similarly to saveCourseService
    if (data.modules) {
      data.modules = JSON.stringify(data.modules);
    }
    if (data.prerequisite) {
      data.prerequisite = JSON.stringify(data.prerequisite);
    }
    if (data.related_courses) {
      data.related_courses = JSON.stringify(data.related_courses);
    }

    await updateSql("courses", data, "id = ?", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Course updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error in updateCourseService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const saveCourseSyllabusService = async (payload) => {
  try {
    if (!Array.isArray(payload) || payload.length === 0) {
      return sendError(400, "Payload must be a non-empty array.");
    }

    const requiredFields = ["course_id", "module_name", "lessons"];

    // Validate each entry
    for (const entry of payload) {
      const missingFieldsError = checkMissingFields(entry, requiredFields);
      if (missingFieldsError) return missingFieldsError;
    }

    // Convert lessons array to JSON string for each entry
    const processedPayload = payload.map((entry) => ({
      ...entry,
      lessons: JSON.stringify(entry.lessons || []),
    }));

    // Use bulk insert
    await bulkInsert("course_syllabus", processedPayload);

    return {
      status: 200,
      data: {
        success: true,
        message: "Course syllabus recorded successfully!",
      },
    };
  } catch (error) {
    console.error("Error in saveCourseSyllabusService:", error);
    return sendError(
      500,
      "An internal server error occurred. Please try again later."
    );
  }
};

export const getCourseSyllabusService = async (course_id) => {
  try {
    let query = "SELECT * FROM course_syllabus WHERE deleted = false";
    const queryParams = [];

    if (course_id) {
      query += " AND course_id = ?";
      queryParams.push(course_id);
    }

    const responses = await executeRawQuery(query, queryParams);

    return {
      status: 200,
      data: {
        success: true,
        message: "Course syllabus fetched successfully!",
        data: responses,
      },
    };
  } catch (error) {
    console.error("Error in getCourseSyllabusService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const deleteCourseSyllabusService = async ({ course_id }) => {
  try {
    const syllabus = await findAll(
      "course_syllabus",
      "course_id = ? AND deleted = false",
      [course_id]
    );

    if (syllabus.length === 0) {
      return sendError(
        404,
        "Syllabus does not exist or has already been deleted."
      );
    }
    await updateSql("course_syllabus", { deleted: true }, "course_id = ?", [
      course_id,
    ]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Course syllabus marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteCourseSyllabusService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const updateCourseSyllabusService = async (payload) => {
  try {
    const { course_id, ...data } = payload;

    if (!course_id) {
      return sendError(400, "Syllabus ID is required.");
    }

    const syllabus = await findAll("course_syllabus", "course_id = ?", [
      course_id,
    ]);
    if (syllabus.length === 0) {
      return sendError(
        404,
        "Syllabus does not exist or has already been deleted."
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    if (data.lessons) {
      data.lessons = JSON.stringify(data.lessons);
    }

    await updateSql("course_syllabus", data, "course_id = ?", [course_id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Course syllabus updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error in updateCourseSyllabusService:", error);
    return sendError(500, "Internal server error.");
  }
};
