const { body } = require('express-validator');
const { AuthUser } = require("../../models");
const { LIST_TIME_ZONES } = require('../../utils/timezone');

const validateSignUp = [
    body('email')
        .notEmpty()
        .withMessage("E-mail không được để trống.")
        .isEmail()
        .withMessage("E-mail không đúng định dạng.")
        .normalizeEmail()
        .custom(value => {
            return AuthUser.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject("E-mail này đã được sử dụng. Vui lòng thử lại.")
                }
            })
        }),
    body('password')
        .notEmpty()
        .withMessage("Mật khẩu không được để trống.")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*)[0-9a-z]{8,}$/)
        .withMessage("Mật khẩu phải chứa ít nhất 1 chữ số và có độ dài là 8 ký tự."),
    body('timeZone')
        .notEmpty()
        .withMessage("Múi giờ không được bỏ trống.")
        .custom(value => {
            if (!LIST_TIME_ZONES.includes(value)) {
                throw new Error("Múi giờ không hợp lệ.")
            }
            return true;
        })
    ,
    body('isWithProject')
        .notEmpty()
        .withMessage("Khởi tạo dự án không được trống.")
        .isBoolean()
]

const validateSignIn = [
    body('email')
        .notEmpty()
        .withMessage("E-mail không được để trống.")
        .isEmail()
        .withMessage("E-mail không đúng định dạng.")
        .normalizeEmail()
        .custom(value => {
            return AuthUser.findOne({ email: value }).then(user => {
                if (!user) {
                    return Promise.reject("Người dùng không tồn tại trên hệ thống.")
                }
            })
        }),
    body('password')
        .notEmpty()
        .withMessage("Mật khẩu không được bỏ trống.")
        .trim()
]



const validateRefreshToken = [
    body('refreshToken')
        .notEmpty()
]


const validateEmail = [
    body('email')
        .notEmpty()
        .withMessage("Your email is empty")
        .isEmail()
        .withMessage("Your email is wrong format")
        .normalizeEmail(),
]

module.exports = {
    validateSignUp,
    validateSignIn,
    validateRefreshToken,
    validateEmail
}