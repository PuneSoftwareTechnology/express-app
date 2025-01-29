import {
  createAdminUserService,
  getAllUsersService,
  loginAdminUserService,
} from "../Services/admin.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const createAdminUser = (req, res) =>
  handleResponse(createAdminUserService, req, res);
export const loginAdminUser = (req, res) =>
  handleResponse(loginAdminUserService, req, res);
export const getAllUsersController = (req, res) =>
  handleResponse(getAllUsersService, req, res);
