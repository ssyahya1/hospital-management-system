import express from "express";

import {
    createUsers,
    loginUser,
    getMyProfile,
    getUsers,
    updateUser,
    deactivateUser,
    reactivateUser,
    forgotPassword,
    resetPassword
} from "../controllers/usercontroller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Admin can create users
router.post("/", 
    authMiddleware, adminMiddleware, createUsers);

// Login
router.post("/login",authRateLimiter, loginUser);
router.post("/forgot-password",authRateLimiter, forgotPassword);
router.post("/reset-password",authRateLimiter, resetPassword);

// Get logged-in user's profile
router.get("/me", authMiddleware, getMyProfile);

// Get all users
router.get("/",
     authMiddleware, adminMiddleware, getUsers);

router.put(
    "/:id",
    
    authMiddleware,
    adminMiddleware,
    updateUser
);

router.put(
    "/:id/deactivate",
    
    authMiddleware,
    adminMiddleware,
    deactivateUser
);

router.put(
    "/:id/reactivate",
    
    authMiddleware,
    adminMiddleware,
    reactivateUser
);

export default router;