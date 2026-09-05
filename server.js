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
    origin: "http://localhost:5173",
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

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});