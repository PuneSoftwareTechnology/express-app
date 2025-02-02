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

    await bulkInsert("email_notification", emailRecords);

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
    const emails = await findAll("email_notification", "deleted = false");
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

    if (!user_email) {
      return sendError(400, "User email is required.");
    }

    // Check if the emails are present for the given user_email
    const placeholders = emails.map(() => "?").join(", ");
    const existingEmails = await findAll(
      "email_notification",
      `email IN (${placeholders}) AND user_email = ? AND deleted = ?`,
      [...emails, user_email, false]
    );

    if (existingEmails.length === 0) {
      return sendError(404, "No matching emails found for the given user.");
    }

    const existingEmailAddresses = existingEmails.map((record) => record.email);
    await updateSql(
      "email_notification",
      { deleted: true },
      `email IN (${placeholders}) AND user_email = ?`,
      [...existingEmailAddresses, user_email]
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Emails deleted successfully.",
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
