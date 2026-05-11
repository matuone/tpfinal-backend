import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { Ticket } from "../models/Ticket.js";
import { Place } from "../models/Places.js";

const normalizeCountMap = (items, keyField) => {
  return items.reduce((accumulator, item) => {
    accumulator[item._id] = item[keyField];
    return accumulator;
  }, {});
};

const getTickets = async (req, res) => {
  const tickets = await Ticket.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(tickets);
};

const createTicket = async (req, res) => {
  const { title, description, type, priority } = req.body;

  if (!title || !description || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const ticket = await Ticket.create({
    userId: req.user.id,
    title,
    description,
    type,
    priority,
  });

  res.status(201).json(ticket);
};

const updateTicket = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["status", "priority"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([field]) => allowedFields.includes(field))
  );

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  const ticket = await Ticket.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    updates,
    { new: true }
  );

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  res.json(ticket);
};

const readErrorLogs = async () => {
  const logsDir = path.join(process.cwd(), "logs");

  try {
    const entries = await fs.readdir(logsDir);
    const logsByFile = await Promise.all(
      entries
        .filter((entry) => entry.endsWith(".json"))
        .map(async (entry) => {
          const content = await fs.readFile(path.join(logsDir, entry), "utf8");
          return JSON.parse(content);
        })
    );

    return logsByFile.flat();
  } catch {
    return [];
  }
};

const getMetrics = async (req, res) => {
  const userObjectId = new mongoose.Types.ObjectId(req.user.id);
  const [ticketStatusAgg, ticketPriorityAgg, placesCount, errorLogs] = await Promise.all([
    Ticket.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: "$status", total: { $sum: 1 } } },
    ]),
    Ticket.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: "$priority", total: { $sum: 1 } } },
    ]),
    Place.countDocuments({ userId: req.user.id }),
    readErrorLogs(),
  ]);

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentErrors = errorLogs.filter((log) => new Date(log.time).getTime() >= sevenDaysAgo);
  const loginErrors = recentErrors.filter((log) => log.url?.startsWith("/auth/login"));

  res.json({
    placesCount,
    ticketsByStatus: normalizeCountMap(ticketStatusAgg, "total"),
    ticketsByPriority: normalizeCountMap(ticketPriorityAgg, "total"),
    errorsLast7Days: recentErrors.length,
    loginErrorsLast7Days: loginErrors.length,
  });
};

export { getTickets, createTicket, updateTicket, getMetrics };