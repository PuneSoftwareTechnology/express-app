import {
  deleteCompanyService,
  editCompanyService,
  getAllCompaniesService,
  saveCompanyService,
} from "../Services/companies.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const saveCompanyController = async (req, res) =>
  handleResponse(saveCompanyService, req, res);

export const getAllCompaniesController = async (req, res) =>
  handleResponse(getAllCompaniesService, req, res);

export const editCompanyController = async (req, res) =>
  handleResponse(editCompanyService, req, res);

export const deleteCompanyController = async (req, res) =>
  handleResponse(deleteCompanyService, req, res);
