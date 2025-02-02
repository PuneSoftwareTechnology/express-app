import {
  executeRawQuery,
  findAll,
  insert,
  updateSql,
} from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const createBlogService = async (fields) => {
  try {
    console.log(fields, "Payload received");

    // Check for required fields
    const requiredFields = [
      "title",
      "slug",
      "author_id",
      "featured_image",
      "conclusion",
    ];
    const missingFields = requiredFields.filter((field) => !fields[field]);

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
export const fetchBlogService = async () => {
  try {
    const blogs = await executeRawQuery(
      "SELECT id,title,slug,created_at,author_id,status FROM blog_posts WHERE deleted =false"
    );
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

    // Check if the blog post exists
    const blog = await findAll("blog_posts", "id = ?", [id]);
    if (blog.length === 0) {
      return sendError(
        404,
        "Blog post does not exist or has already been deleted."
      );
    }

    // Ensure there is data to update
    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }
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
export const fetchOneBlogService = async ({ id }) => {
  try {
    // Fetch the blog post based on the id
    const blog = await findAll(
      "blog_posts",
      "id = ? AND status != 'ARCHIVED'",
      [id]
    );

    if (blog.length === 0) {
      // If no blog found or it's archived, return an error message
      return sendError(
        404,
        "Blog does not exist or has already been archived."
      );
    }

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
