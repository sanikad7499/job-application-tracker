const express = require("express");
const prisma = require("../utils/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

// POST /ai/draft-followup
// Body: { applicationId: string, kind?: "email" | "resume_notes" }
// Generates a follow-up email draft or resume bullet suggestions based on
// the application's company, role, status, and notes. The API key never
// leaves the backend.
router.post("/draft-followup", async (req, res) => {
  const { applicationId, kind = "email" } = req.body;

  if (!applicationId) {
    return res.status(400).json({ error: "applicationId is required" });
  }
  if (!["email", "resume_notes"].includes(kind)) {
    return res.status(400).json({ error: "kind must be 'email' or 'resume_notes'" });
  }

  try {
    const application = await prisma.application.findFirst({
      where: { id: applicationId, userId: req.userId },
    });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const prompt = buildPrompt(application, kind);

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "AI feature is not configured (missing ANTHROPIC_API_KEY)" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return res.status(502).json({ error: "AI service is temporarily unavailable, try again shortly" });
    }

    const data = await response.json();
    const draft = data.content?.map((block) => block.text || "").join("\n").trim();

    if (!draft) {
      return res.status(502).json({ error: "AI did not return a usable draft, try again" });
    }

    const updated = await prisma.application.update({
      where: { id: application.id },
      data: { aiDraft: draft },
    });

    res.json({ draft: updated.aiDraft });
  } catch (err) {
    console.error("AI draft error:", err);
    res.status(500).json({ error: "Could not generate AI draft" });
  }
});

function buildPrompt(application, kind) {
  const context = `Company: ${application.company}\nRole: ${application.role}\nStatus: ${application.status}\nNotes: ${application.notes || "None"}`;

  if (kind === "resume_notes") {
    return `Based on this job application, suggest 2-3 short resume bullet points tailoring the candidate's experience to the role. Be concise and specific.\n\n${context}`;
  }

  return `Write a short, professional follow-up email for this job application. Keep it under 150 words, warm but not overly familiar, and reference the specific role and company.\n\n${context}`;
}

module.exports = router;
