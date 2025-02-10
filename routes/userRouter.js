const { Router } = require("express");
const controller = require("../controllers/userController");
const router = Router();
router.post("/", controller.getLogin);
router.get("/home", controller.getRedirectHome);
module.exports = router;
