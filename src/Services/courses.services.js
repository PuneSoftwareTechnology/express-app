import {
  bulkInsert,
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveCourseService = async (payload) => {
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
      "category_id",
    ];
    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    const processedPayload = {
      ...payload,
      intro: JSON.stringify(payload.intro || []),
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
      query += ` AND category_id  = $1`;
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
    const course = await findAll("courses", "id  = $1 AND deleted = false", [
      id,
    ]);

    if (course.length === 0) {
      return sendError(
        404,
        "Course does not exist or has already been deleted."
      );
    }
    await updateSql("courses", { deleted: true }, "id  = $1", [id]);

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

    const course = await findAll("courses", "id  = $1", [id]);
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

    await updateSql("courses", data, "id  = $1", [id]);

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
    if (
      !payload ||
      !Array.isArray(payload.courses_syllabus) ||
      payload.courses_syllabus.length === 0
    ) {
      return sendError(
        400,
        "Payload must contain a non-empty 'courses_syllabus' array."
      );
    }

    const requiredFields = ["course_id", "category_id", "user_email"];

    // Check for missing fields in main payload
    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    const processedPayload = payload.courses_syllabus.map((module) => ({
      course_id: payload.course_id,
      category_id: payload.category_id,
      user_email: payload.user_email || null,
      module_name: module.module_name,
      lessons: JSON.stringify(module.lessons || []),
    }));
    console.log(processedPayload);

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
      query += " AND course_id = $1";
      queryParams.push(course_id);
    }

    const responses = await executeRawQuery(query, queryParams);

    if (responses.length === 0) {
      return {
        status: 404,
        data: {
          success: false,
          message: "No course syllabus found!",
          data: [],
        },
      };
    }

    const formattedResponse = Object.values(
      responses.reduce(
        (
          acc,
          {
            course_id,
            category_id,
            module_name,
            lessons,
            deleted,
            user_email,
            created_at,
            updated_at,
          }
        ) => {
          if (!acc[course_id]) {
            acc[course_id] = {
              deleted,
              user_email,
              created_at,
              updated_at,
              course_id,
              category_id,
              courses_syllabus: [],
            };
          }

          acc[course_id].courses_syllabus.push({
            module_name,
            lessons,
          });

          return acc;
        },
        {}
      )
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Course syllabus fetched successfully!",
        data: formattedResponse,
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
      "course_id  = $1 AND deleted = false",
      [course_id]
    );

    if (syllabus.length === 0) {
      return sendError(
        404,
        "Syllabus does not exist or has already been deleted."
      );
    }
    await updateSql("course_syllabus", { deleted: true }, "course_id = $1", [
      course_id,
    ]);

    return {
      status: 200,
      data: {
        success: true,
        message: "All course syllabus entries marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteCourseSyllabusService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const updateCourseSyllabusService = async (payload) => {
  try {
    if (
      !payload ||
      !Array.isArray(payload.courses_syllabus) ||
      payload.courses_syllabus.length === 0
    ) {
      return sendError(
        400,
        "Payload must contain a non-empty 'courses_syllabus' array."
      );
    }

    const requiredFields = ["course_id", "category_id", "user_email"];

    // Check for missing fields in main payload
    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    const processedPayload = payload.courses_syllabus.map((module) => ({
      course_id: payload.course_id,
      category_id: payload.category_id,
      user_email: payload.user_email || null,
      module_name: module.module_name,
      lessons: JSON.stringify(module.lessons || []),
    }));

    // Delete existing syllabus entries for the course
    await updateSql("course_syllabus", { deleted: true }, "course_id = $1", [
      payload.course_id,
    ]);

    // Insert new syllabus entries
    await bulkInsert("course_syllabus", processedPayload);

    return {
      status: 200,
      data: {
        success: true,
        message: "Course syllabus updated successfully!",
      },
    };
  } catch (error) {
    console.error("Error in updateCourseSyllabusService:", error);
    return sendError(
      500,
      "An internal server error occurred. Please try again later."
    );
  }
};

export const getCourseNamesService = async () => {
  try {
    const query = "SELECT id, name FROM courses WHERE deleted = false";
    const responses = await executeRawQuery(query);

    return {
      status: 200,
      data: {
        success: true,
        message: "Course names fetched successfully!",
        data: [
          {
            id: 0,
            name: "Select",
          },
          ...responses,
        ],
      },
    };
  } catch (error) {
    console.error("Error in getCourseNamesService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const getCourseCategoriesService = async () => {
  try {
    const query =
      "SELECT id, category_name as name, category_enum FROM course_category WHERE deleted = false";
    const responses = await executeRawQuery(query);

    return {
      status: 200,
      data: {
        success: true,
        message: "Categories fetched successfully!",
        data: [
          {
            id: 0,
            name: "Select",
          },
          ...responses,
        ],
      },
    };
  } catch (error) {
    console.error("Error in getCourseCatgoriesService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};
