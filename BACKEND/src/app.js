import express from "express";
import dotenv from "dotenv";
import userRoutes from "../src/api/routes/userRoutes.js";
import dryerRoutes from "../src/api/routes/dryersRoutes.js";
import reservationRoutes from "../src/api/routes/reservationsRoutes.js";
import uploadRoutes from "../src/api/routes/uploadRoutes.js"
import cropTypesRoutes from "../src/api/routes/cropTypesRoutes.js";
import path from "path"; 
import { errorHandler } from "../src/api/middleware/errorHandler.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/dryers", dryerRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/upload", uploadRoutes);  
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/crop-types", cropTypesRoutes);

// Error handling
app.use(errorHandler);

export default app;
