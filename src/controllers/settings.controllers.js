import {
  deleteEmailsService,
  getAllActiveNotificationsService,
  saveNotificationEMailService,
} from "../Services/settings.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const saveNotificationEmailController = (req, res) =>
  handleResponse(saveNotificationEMailService, req, res);

export const getAllActiveNotificationsController = (req, res) =>
  handleResponse(getAllActiveNotificationsService, req, res);

export const deleteNotificationEmailController = async (req, res) =>
  handleResponse(deleteEmailsService, req, res);
