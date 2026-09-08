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


const router = express.Router();

router.post(
    "/",
    
    authMiddleware,
    authorizeRoles("doctor", "admin"),
    validateAppointment,
    createAppointments
);

router.get(
    "/",
    
    authMiddleware,
    authorizeRoles("doctor", "admin"),
    getAppointments
);

router.get(
    "/me",
   
    authMiddleware,
    authorizeRoles("patient"),
    getMyAppointments
);

router.get(
    "/:id",
   
    authMiddleware,
    getAppointmentById
);

router.patch(
    "/:id",
   
    authMiddleware,
    authorizeRoles("doctor", "admin"),
    validateAppointmentUpdate,
    updateAppointment
);

export default router;