const express = require('express')
const router = express.Router()

const {
  registerUser,
  loginUser,
  getMe,
  authMiddleware,
} = require("../controllers/userController");
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)


userRoutes.post(
  "/verify-mail-token",
  authMiddleware,
  generateVerificationToken
);
userRoutes.put("/verify-account", authMiddleware, accountVerification);


module.exports = router