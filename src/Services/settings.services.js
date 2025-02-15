import { bulkInsert, findAll, updateSql } from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

export const saveNotificationEMailService = async (payload) => {
  try {
    const requiredFields = ["emails", "user_email"];
    const missingFieldsError = checkMissingFields(payload, requiredFields);

    if (missingFieldsError) return missingFieldsError;

    const { emails, user_email } = payload;

    if (!Array.isArray(emails) || emails.length === 0) {
      return sendError(400, "Emails should be a non-empty array.");
    }

    const emailRecords = emails.map((email) => ({ email, user_email }));

    await bulkInsert("notification_emails", emailRecords);

    return {
      status: 200,
      data: {
        success: true,
        message: "Notification emails saved successfully!",
      },
    };
  } catch (error) {
    console.error("Error in saving notification emails:", error);
    return sendError(
      500,
      "An internal server error occurred while saving the notification emails."
    );
  }
};

export const getAllActiveNotificationsService = async () => {
  try {
    const emails = await findAll("notification_emails", "deleted = false");
    return {
      status: 200,
      data: {
        success: true,
        message: "Active notifications fetched successfully.",
        data: emails,
      },
    };
  } catch (error) {
    console.error("Error in getting active notifications:", error);
    return sendError(
      500,
      "An internal server error occurred while fetching the notifications."
    );
  }
};

export const deleteEmailsService = async (payload) => {
  try {
    const { emails, user_email } = payload;
    const requiredFields = ["emails", "user_email"];

    const missingFieldsError = checkMissingFields(payload, requiredFields);
    if (missingFieldsError) return missingFieldsError;

    if (!Array.isArray(emails) || emails.length === 0) {
      return sendError(400, "Emails should be a non-empty array.");
    }

    // Check if the emails exist
    const placeholders = emails.map((_, index) => `$${index + 1}`).join(", ");
    const existingEmails = await findAll(
      "notification_emails",
      `email IN (${placeholders}) AND deleted = $${emails.length + 1}`,
      [...emails, false]
    );

    if (existingEmails.length === 0) {
      return sendError(404, "No matching emails found.");
    }

    const existingEmailAddresses = existingEmails.map((record) => record.email);

    // Ensure there are existing emails to update
    if (existingEmailAddresses.length === 0) {
      return sendError(404, "No emails found to delete.");
    }

    // Generate placeholders dynamically for WHERE clause
    const updatePlaceholders = existingEmailAddresses
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    // Call updateSql function
    await updateSql(
      "notification_emails",
      { deleted: true }, // Properly formatted object for SET clause
      `email IN (${updatePlaceholders})`, // Adjusted WHERE clause
      existingEmailAddresses // Properly passed whereParams
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Emails deleted successfully.",
        performed_by: user_email, // Just for tracking
      },
    };
  } catch (error) {
    console.error("Error in deleting emails:", error);
    return sendError(
      500,
      "An internal server error occurred while deleting the emails."
    );
  }
};
