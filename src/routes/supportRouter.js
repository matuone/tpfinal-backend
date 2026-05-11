import { Router } from "express";
import {
  getTickets,
  createTicket,
  updateTicket,
  getMetrics,
} from "../controllers/supportController.js";

const router = Router();

router.get("/tickets", getTickets);
router.post("/tickets", createTicket);
router.patch("/tickets/:id", updateTicket);
router.get("/metrics", getMetrics);

export { router };