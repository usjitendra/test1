const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/add', authMiddleware, userController.addUser);
router.get("/get-all", userController.getAllUserDetails);
router.put("/edit/:userId", authMiddleware, userController.updateUser);
router.delete("/delete/:userId", authMiddleware, userController.toggleUserDeleteStatus);
router.patch("/toggle-status/:userId", authMiddleware, userController.toggleUserStatus);
router.post("/change-password", authMiddleware, userController.changePassword);
router.put("/update", authMiddleware, userController.updateUserBySelf);

module.exports = router;