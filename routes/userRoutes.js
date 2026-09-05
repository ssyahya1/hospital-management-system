import express from "express";

import {
    createUsers,
    loginUser,
    getMyProfile,
    getUsers,
    updateUser,
    deactivateUser,
    reactivateUser
} from "../controllers/usercontroller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

const router = express.Router();

// Admin can create users
router.post("/", apiKeyMiddleware,authMiddleware, adminMiddleware, createUsers);

// Login
router.post("/login", loginUser);

// Get logged-in user's profile
router.get("/me", authMiddleware, getMyProfile);

// Get all users
router.get("/", apiKeyMiddleware, authMiddleware, adminMiddleware, getUsers);

router.put(
    "/:id",
    apiKeyMiddleware,
    authMiddleware,
    adminMiddleware,
    updateUser
);

router.put(
    "/:id/deactivate",
    apiKeyMiddleware,
    authMiddleware,
    adminMiddleware,
    deactivateUser
);

router.put(
    "/:id/reactivate",
    apiKeyMiddleware,
    authMiddleware,
    adminMiddleware,
    reactivateUser
);

export default router;