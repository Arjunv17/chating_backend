const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/response");

const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return errorResponse(res, 404, { message: `Authorization Must!!` })
        } else {
            let tokenVerify = await verifyToken(token);
            if (tokenVerify) {
                if ((tokenVerify.role === 'user')) {
                    req.user = tokenVerify;
                    next()
                } else {
                    return errorResponse(res, 404, { message: `Unauthorized!!` })
                }
            } else {
                return errorResponse(res, 404, { message: `Unauthorized!!` })
            }
        }
    } catch (error) {
        return errorResponse(res, 500, { message: `Internal Server Error: ${error}` })
    }
}


module.exports = authentication