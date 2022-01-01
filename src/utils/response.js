exports.resServerError = (res, code, msg, errors) => {
    return res.status(code).json({
        code,
        msg,
        errors,
    });
}

exports.resServerSuccess = (res, code, msg, data = []) => {
    return res.status(code).json({
        code,
        msg,
        data
    });
}
