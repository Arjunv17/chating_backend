// Send Success Response
const successResponse = (res, statusCode, data) => {
    if (!res || !res.status) {
        throw new Error('Response object is missing or incorrect');
    }
    res.status(statusCode).json({
        success: true,
        data
    });
};

// Send Error Response
const errorResponse = (res, statusCode, data) => {
    if (!res || !res.status) {
        throw new Error('Response object is missing or incorrect');
    }
    res.status(statusCode).json({
        success: false,
        data
    });
};

module.exports = { successResponse, errorResponse };
