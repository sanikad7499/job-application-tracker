const express = require("express");
const prisma = require("../utils/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const VALID_STATUSES = ["applied", "interviewing", "offer", "rejected"];

router.use(requireAuth); // every route below requires a valid token

// GET /applications — list the current user's applications
router.get("/", async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(applications);
  } catch (err) {
    console.error("List applications error:", err);
    res.status(500).json({ error: "Could not load applications" });
  }
});

// POST /applications — create a new application
router.post("/", async (req, res) => {
  const { company, role, status, appliedDate, notes } = req.body;

  if (!company || !role) {
    return res.status(400).json({ error: "Company and role are required" });
  }
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
  }

  try {
    const application = await prisma.application.create({
      data: {
        userId: req.userId,
        company,
        role,
        status: status || "applied",
        appliedDate: appliedDate ? new Date(appliedDate) : undefined,
        notes: notes || null,
      },
    });
    res.status(201).json(application);
  } catch (err) {
    console.error("Create application error:", err);
    res.status(500).json({ error: "Could not create application" });
  }
});

// GET /applications/:id — fetch one application (only if it belongs to the user)
router.get("/:id", async (req, res) => {
  try {
    const application = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    console.error("Get application error:", err);
    res.status(500).json({ error: "Could not load application" });
  }
});

// PUT /applications/:id — update status/notes/etc.
router.put("/:id", async (req, res) => {
  const { company, role, status, appliedDate, notes } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
  }

  try {
    const existing = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        company: company ?? existing.company,
        role: role ?? existing.role,
        status: status ?? existing.status,
        appliedDate: appliedDate ? new Date(appliedDate) : existing.appliedDate,
        notes: notes ?? existing.notes,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error("Update application error:", err);
    res.status(500).json({ error: "Could not update application" });
  }
});

// DELETE /applications/:id
router.delete("/:id", async (req, res) => {
  try {
    const existing = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    await prisma.application.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error("Delete application error:", err);
    res.status(500).json({ error: "Could not delete application" });
  }
});

module.exports = router;
