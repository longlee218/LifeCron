class MyError extends  Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.status = code.toString().startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = MyError;