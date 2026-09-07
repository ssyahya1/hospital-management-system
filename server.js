import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import transactionRoutes from "./routes/transactionRoute.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://hospital-management-system-eta-brown-31.vercel.app",
  "https://hospital-management-system-i8jg0rncd-syed-yahya.vercel.app"
].filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      //if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) 
            if (
        !origin ||
        origin === "http://localhost:5173" ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) 
      {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"] // <-- Added x-api-key
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
