import {
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const createBlogService = async (fields) => {
  try {
    // Check for required fields
    const requiredFields = [
      "title",
      "slug",
      "author_id",
      "featured_image",
      "conclusion",
    ];
    const missingFields = checkMissingFields(fields, requiredFields);

    if (missingFields.length > 0) {
      return {
        status: 400,
        data: {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
      };
    }

    // Convert the array to a JSON string
    if (
      fields.tertiary_content_points &&
      Array.isArray(fields.tertiary_content_points)
    ) {
      fields.tertiary_content_points = JSON.stringify(
        fields.tertiary_content_points
      );
    }

    await insert("blog_posts", fields);

    return {
      status: 200,
      data: { success: true, message: "Blog post created successfully!" },
    };
  } catch (error) {
    console.error("Error in createBlogService:", error);
    return {
      status: 500,
      data: {
        success: false,
        message: "An internal server error occurred. Please try again later.",
      },
    };
  }
};

// Get All Blog Posts Service
export const fetchBlogService = async (landing_page) => {
  try {
    const pageType = landing_page?.landing_page || ""; // Extract the actual string

    let baseQuery =
      "SELECT id, introduction, featured_image, title, slug, created_at, category,  author_id FROM blog_posts WHERE deleted = false";

    const queryOptions = {
      blog: " AND status = 'PUBLISHED' ORDER BY created_at DESC",
      main: " AND status = 'PUBLISHED' ORDER BY created_at DESC LIMIT 4",
    };

    const query =
      pageType in queryOptions
        ? baseQuery + queryOptions[pageType]
        : "SELECT id, title, slug, created_at, author_id,category, status FROM blog_posts WHERE deleted = false";

    const blogs = await executeRawQuery(query);

    return {
      status: 200,
      data: {
        success: true,
        message: "Blog posts fetched successfully!",
        data: blogs,
      },
    };
  } catch (error) {
    console.error("Error in fetching blog posts:", error);
    return sendError(
      "An internal server error occurred. Please try again later."
    );
  }
};

export const updateBlogService = async (payload) => {
  try {
    const { id, ...data } = payload;

    const blog = await findAll("blog_posts", "id = ?", [id]);
    if (blog.length === 0) {
      return sendError(
        404,
        "Blog post does not exist or has already been deleted."
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    if (
      data.tertiary_content_points &&
      Array.isArray(data.tertiary_content_points)
    ) {
      data.tertiary_content_points = JSON.stringify(
        data.tertiary_content_points
      );
    }

    // Update the blog post
    await updateSql("blog_posts", data, "id = ?", [id]);

    return {
      status: 200,
      data: {
        success: true,
        message: "Blog post updated successfully!",
      },
    };
  } catch (error) {
    console.error("Error in updateBlogService:", error);
    return sendError(
      500,
      "An internal server error occurred. Please try again later."
    );
  }
};

export const fetchOneBlogService = async ({ slug }) => {
  try {
    // Fetch the blog post based on the slug
    const blog = await findAll(
      "blog_posts",
      "slug = ? AND status != 'ARCHIVED'",
      [slug]
    );

    if (blog.length === 0) {
      // If no blog found or it's archived, return an error message
      return sendError(
        404,
        "Blog does not exist or has already been archived."
      );
    }

    delete blog[0]?.created_at;
    delete blog[0]?.updated_at;

    // If blog found, return the data successfully
    return {
      status: 200,
      data: {
        success: true,
        message: "Blog fetched successfully.",
        data: blog[0], // Assuming findAll returns an array of blogs, use the first one
      },
    };
  } catch (error) {
    console.error("Error in fetching blog post:", error);
    return sendError(
      500,
      "An internal server error occurred. Please try again later."
    );
  }
};
