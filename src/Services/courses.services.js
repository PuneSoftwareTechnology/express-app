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
      intro: JSON.stringify(
        Array.isArray(payload.intro) ? payload.intro : [payload.intro] || []
      ),
      modules: JSON.stringify(
        Array.isArray(payload.modules)
          ? payload.modules
          : [payload.modules] || []
      ),
      prerequisite: JSON.stringify(
        Array.isArray(payload.prerequisite)
          ? payload.prerequisite
          : [payload.prerequisite] || []
      ),
      related_courses: JSON.stringify(
        Array.isArray(payload.related_courses)
          ? payload.related_courses
          : [payload.related_courses] || []
      ),
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
    let query =
      "SELECT * FROM courses WHERE deleted = false  order by updated_at desc";
    if (category) {
      query = ` SELECT id, name, description, slug, featured_image from courses where deleted = FALSE and category_id = $1  order by updated_at desc`;
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
    if (data.intro) {
      data.intro = JSON.stringify(data.intro);
    }
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

    const requiredFields = ["course_id", "courses_syllabus", "user_email"];

    // Check for missing fields in main payload
    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    const processedPayload = payload.courses_syllabus.map((module) => ({
      course_id: payload.course_id,
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
    let query =
      "SELECT * FROM course_syllabus WHERE deleted = false ORDER BY module_index ASC";
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
            module_index,
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
            module_index,
            lessons,
            created_at,
          });

          return acc;
        },
        {}
      )
    ).map((course) => {
      course.courses_syllabus.sort((a, b) => a.module_index - b.module_index);
      return course;
    });

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
  console.log(payload);

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

    const requiredFields = ["course_id", "courses_syllabus", "user_email"];

    // Check for missing fields in main payload
    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    const processedPayload = payload.courses_syllabus.map((module) => ({
      course_id: payload.course_id,
      user_email: payload.user_email || null,
      module_name: module.module_name,
      module_index: parseInt(module.module_index),
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
    const query =
      "SELECT id, name FROM courses WHERE deleted = false  order by updated_at desc";
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
      "SELECT id, category_name as name, category_enum FROM course_category WHERE deleted = false  order by created_at desc";
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

export const getCourseDetailsService = async ({ slug }) => {
  try {
    const courseQuery = `SELECT 
                                c1.id,
                                c1.name,
                                c1.intro,
                                c1.featured_image,
                                c1.description,
                                c1.training_procedure,
                                c1.slug,
                                c1.module_heading,
                                c1.modules,
                                c1.prerequisite,
                                c1.created_at,
                                c1.updated_at,
                                c1.user_email,
                                c1.deleted,
                                c1.category_id,
                                COALESCE(
                                    jsonb_agg(
                                        jsonb_build_object(
                                            'id', related_courses_info.id,
                                            'name', related_courses_info.name,
                                            'slug', related_courses_info.slug,
                                            'featured_image', related_courses_info.featured_image
                                        )
                                    ) FILTER (WHERE related_courses_info.deleted = false), '[]'::jsonb
                                ) AS related_courses
                            FROM 
                                courses c1
                            LEFT JOIN 
                                courses related_courses_info
                                ON related_courses_info.id = ANY (SELECT jsonb_array_elements_text(c1.related_courses)::uuid)
                            WHERE 
                                c1.slug = $1
                                AND c1.deleted = false
                            GROUP BY 
                                c1.id  order by updated_at desc`;
    const course = await executeRawQuery(courseQuery, [slug]);

    if (course.length === 0) {
      return {
        status: 404,
        data: {
          success: false,
          message: "Course not found!",
        },
      };
    }

    const courseId = course[0].id;

    const projectsQuery =
      "SELECT id, name, description FROM projects WHERE related_course = $1 AND deleted = false order by created_at";
    const projects = await executeRawQuery(projectsQuery, [courseId]);

    const syllabusQuery =
      "SELECT * FROM course_syllabus WHERE course_id = $1   AND deleted = false ORDER BY module_index ASC";

    const syllabusResponses = await executeRawQuery(syllabusQuery, [courseId]);

    const formattedSyllabus = Object.values(
      syllabusResponses.reduce(
        (acc, { course_id, module_name, lessons, created_at }) => {
          if (!acc[course_id]) {
            acc[course_id] = {
              course_id,
              courses_syllabus: [],
            };
          }

          acc[course_id].courses_syllabus.push({
            module_name,
            lessons,
            created_at, // Include created_at for sorting
          });

          return acc;
        },
        {}
      )
    ).map((course) => {
      course.courses_syllabus.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      return course;
    });

    console.log(formattedSyllabus);

    const jobsQuery =
      "SELECT id,name,description FROM jobs WHERE related_course = $1 AND deleted = false";
    const jobs = await executeRawQuery(jobsQuery, [courseId]);
    const testimonials = await executeRawQuery(
      "SELECT * FROM testimonials WHERE deleted = false AND course_id = $1",
      [courseId]
    );
    const blogs = await executeRawQuery(
      "SELECT id, introduction, featured_image, title, slug, created_at, category_id, course_id, author_id FROM blog_posts WHERE deleted = false AND course_id = $1 AND status = 'PUBLISHED' order by updated_at desc",
      [courseId]
    );

    const faqs = await executeRawQuery(
      "SELECT * FROM faqs WHERE deleted = false AND course_id = $1 order by updated_at desc",
      [courseId]
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Course details fetched successfully!",
        data: {
          course: course[0],
          projects,
          syllabus: formattedSyllabus,
          jobs,
          testimonials,
          blogs,
          faqs,
        },
      },
    };
  } catch (error) {
    console.error("Error in getCourseDetailsService:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};
