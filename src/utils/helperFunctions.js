export const sendError = (message) => ({
  status: 500,
  data: { error: message },
});

export const checkMissingFields = (fields, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !fields[field]);
  return missingFields.length > 0
    ? {
        status: 400,
        data: {
          error: `The following fields are required: ${missingFields.join(
            ", "
          )}.`,
        },
      }
    : null;
};

export const handleResponse = async (service, req, res) => {
  try {
    const result = await service(req.body);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
