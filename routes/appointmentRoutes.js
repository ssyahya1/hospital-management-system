import express from "express";

import {
    createAppointments,
    getAppointments,
    getMyAppointments,
    getAppointmentById,
    updateAppointment
} from "../controllers/appointmentController.js";

import { validateAppointment } from "../middleware/validateAppointment.js";
import { validateAppointmentUpdate } from "../middleware/validateAppointmentUpdate.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

const router = express.Router();

router.post(
    "/",
    apiKeyMiddleware,
    authMiddleware,
    authorizeRoles("doctor", "admin"),
    validateAppointment,
    createAppointments
);

router.get(
    "/",
    apiKeyMiddleware,
    authMiddleware,
    authorizeRoles("doctor", "admin"),
    getAppointments
);

router.get(
    "/me",
    apiKeyMiddleware,
    authMiddleware,
    authorizeRoles("patient"),
    getMyAppointments
);

router.get(
    "/:id",
    apiKeyMiddleware,
    authMiddleware,
    getAppointmentById
);

router.patch(
    "/:id",
    apiKeyMiddleware,
    authMiddleware,
    authorizeRoles("doctor", "admin"),
    validateAppointmentUpdate,
    updateAppointment
);

export default router;