import express from "express";
import { displayDashboard } from "../controllers/dashboardDisplayController.js";

const router = express.Router();

router.get("/logs", displayDashboard);

export default router;
