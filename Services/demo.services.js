import { insert } from "../database/dbConnection.js";

export const processDemoRequest = async ({ name, email, phone, message }) => {
  try {
    // Validate input
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!message) missingFields.push("message");

    if (missingFields.length > 0) {
      return {
        status: 400,
        data: {
          error: `The following fields are required: ${missingFields.join(
            ", "
          )}.`,
        },
      };
    }

    // Sanitize input (basic example)
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
    };

    // Insert into the database
    await insert("demo_responses", sanitizedData);

    return {
      status: 200,
      data: {
        success: true,
        message: "Demo request processed successfully!",
      },
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in processDemoRequest:", error);

    // Return a consistent error response
    return {
      status: 500,
      data: {
        error: "An internal server error occurred. Please try again later.",
      },
    };
  }
};
