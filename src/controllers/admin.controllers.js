import {
  createAdminUserService,
  deleteUserService,
  getAllUsersService,
  loginAdminUserService,
  updateUserService,
} from "../Services/admin.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const createAdminUser = (req, res) =>
  handleResponse(createAdminUserService, req, res);
export const loginAdminUser = (req, res) =>
  handleResponse(loginAdminUserService, req, res);
export const getAllUsersController = (req, res) =>
  handleResponse(getAllUsersService, req, res);

export const deleteUserController = (req, res) =>
  handleResponse(deleteUserService, req, res);

export const updateUserController = (req, res) =>
  handleResponse(updateUserService, req, res);
