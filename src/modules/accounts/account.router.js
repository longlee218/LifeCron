const router = require("express").Router();
const { authMiddleware } = require("../auth");

const {
    profileInfo
} = require("./account.controller");


router.get("/info", authMiddleware, profileInfo);

module.exports = router;