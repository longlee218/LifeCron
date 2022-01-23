const { resServerError } = require("./response");
const { validationResult } = require("express-validator");

exports.catchAsync = (fn) => {
    return (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resServerError(res, 422, "validate fail", errors.mapped());
        }
        fn(req, res, next).catch(error => {
            console.log(error)
            // res.status(error.status).json(error);
            next(error);
        })
    }
}
