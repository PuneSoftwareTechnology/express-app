export const sendError = (statusCode, message) => ({
  status: statusCode,
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
    let result;
    let requestData;
    if (req.method === "GET") {
      requestData = req.query;
      if (isEmptyObject(requestData)) {
        requestData = null;
      }
      result = await service(requestData);
    } else if (req.method === "POST" || req.method === "PATCH") {
      requestData = req.body;
      if (isEmptyObject(requestData)) {
        requestData = null;
      }
      result = await service(requestData);
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    res.status(result.status).json(result.data);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};
