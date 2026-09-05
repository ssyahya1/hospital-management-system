import express from "express";
//import{getPatients,createPatient} from "../controllers/patientController.js";
import { validatePatient } from "../middleware/validatePatient.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
    getPatients,
    createPatient,
    getMyProfile
} from "../controllers/patientController.js";

const router = express.Router();

router.use((req, res, next) => {
    console.log("PATIENT ROUTE HIT:", req.method, req.originalUrl);
    next();
});
router.get(
    "/",
    authMiddleware,
    authorizeRoles("doctor", "admin"),
    getPatients
);
router.get("/me", authMiddleware, authorizeRoles("patient"), getMyProfile);
router.post("/", authMiddleware,authorizeRoles("doctor","admin"), validatePatient, createPatient);

export default router;