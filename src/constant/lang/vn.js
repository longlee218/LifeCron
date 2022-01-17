const vn = {
    error: {
        authen: {
            email_is_empty: 'E-mail không được bỏ trống.',
            password_is_empty: 'Mật khẩu không được bỏ trống.',
            username_is_empty: 'Tên người dùng không được bỏ trống.',
            password_length: 'Mật khẩu phải có tối thiểu 8 ký tự',
            wrong_password: 'Mật khẩu không chính xác.',
            user_exists_already: 'Tài khoản đã tồn tại.',
            user_does_not_exist_already: 'Tài khoản không tồn tại.',
            email_is_in_wrong_format: 'E-mail không đúng định dạng.',
            account_not_verify: "Tài khoản chưa được xác thực.",
            expire_email: "E-mail xác thực đã hết hạn, vui lòng click vào đây để nhận lại.",
            wrong_token: "Token không chính xác",
            account_already_verified: "Tài khoản đã được xác thực."
        },
        server: {
            some_thing_wrong: 'Đã có lỗi xảy ra, vui lòng thử lại.',
        },
    },
    success: {
        authen: {
            verify_email: "Tài khoản xác thực thành công."
        },
    },
    info: {
        send_email: "Hệ thống đã gửi e-mail xác thực tới địa chỉ: {xxx}. Vui lòng kiểm tra."
    }
}

module.exports = vn;