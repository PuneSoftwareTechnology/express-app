import { processDemoRequest } from "../Services/demoRequests.js";

export const handleDemoRequest = async (req, res) => {
  try {
    // Call the service function to process the request
    console.log(req.body, ">/././././");

    const result = await processDemoRequest(req.body);

    // Send the response
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error in handleDemoRequest:", error);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
