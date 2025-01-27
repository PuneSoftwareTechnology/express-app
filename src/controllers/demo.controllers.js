import {
  getAllresponses,
  processDemoRequest,
} from "../Services/demo.services.js";

export const handleDemoRequest = async (req, res) => {
  try {
    const result = await processDemoRequest(req.body);

    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error in handleDemoRequest:", error);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getDemos = async (req, res) => {
  try {
    const result = await getAllresponses(req.body);

    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error in fetching demos:", error);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
