import {
  createBlogService,
  fetchBlogService,
  fetchOneBlogService,
  updateBlogService,
} from "../Services/blog.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const createBlogController = (req, res) =>
  handleResponse(createBlogService, req, res);

export const fetchBlogsController = (req, res) =>
  handleResponse(fetchBlogService, req, res);

export const updateBlogController = (req, res) =>
  handleResponse(updateBlogService, req, res);

export const fetchOneBlogController = (req, res) =>
  handleResponse(fetchOneBlogService, req, res);
