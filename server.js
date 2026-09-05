import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import transactionRoutes from "./routes/transactionRoute.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

const app = express();
app.use(
  cors({
    origin: "https://hospital-management-system-eta-brown-31.vercel.app",
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Hospital Management API is running"
    });
});
app.use(errorHandler);

export default app;