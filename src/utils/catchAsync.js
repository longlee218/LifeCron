const {validationResult} = require("express-validator");
const {resServerError} = require("./response");

exports.catchAsync = (fn) => {
    return (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resServerError(res, 422, "fail", errors.mapped());
        }
        fn(req, res, next).catch(error => next(error))
    }
}
