const router = require("express").Router();
const { authMiddleware } = require("../auth");

const {
    myChecks
} = require("./front.controller")

router.get("/project/:code/checks", authMiddleware, myChecks);

module.exports = router;