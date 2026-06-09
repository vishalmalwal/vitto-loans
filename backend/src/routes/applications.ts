import { Router, Request, Response } from "express";
import {
  getApplications,
  createApplication,
  updateApplicationStatus,
  getSummary,
  isUsingFallback,
} from "../db.ts";
import { validateApplication } from "../validators.ts";

const router = Router();

// Extra health check endpoint to declare DB state (for glassmorphism status indicator)
router.get("/db-status", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    fallbackActive: isUsingFallback(),
    storageType: isUsingFallback() ? "JSON File Fallback" : "Live PostgreSQL Instance",
  });
});

// 1. POST /api/applications - Submit a new loan application
router.post("/applications", async (req: Request, res: Response) => {
  try {
    const check = validateApplication(req.body);
    if (!check.isValid) {
      return res.status(400).json({ error: check.error });
    }

    const { name, mobile, amount, purpose, language } = req.body;
    
    const parsedAmount = parseFloat(amount);
    const newApp = await createApplication({
      name,
      mobile,
      amount: parsedAmount,
      purpose,
      language,
    });

    return res.status(201).json(newApp);
  } catch (error: any) {
    console.error("POST /applications error:", error);
    return res.status(500).json({ error: "Failed to submit loan application. Please try again." });
  }
});

// 2. GET /api/applications - Return all applications ordered by created_at DESC with optional filtering
router.get("/applications", async (req: Request, res: Response) => {
  try {
    const statusFilter = req.query.status as string | undefined;

    // Strict validation if filter is passed
    if (statusFilter && !["pending", "approved", "rejected"].includes(statusFilter)) {
      return res.status(400).json({ error: "Invalid status filter. Must be one of: pending, approved, rejected." });
    }

    const apps = await getApplications(statusFilter);
    return res.json(apps);
  } catch (error: any) {
    console.error("GET /applications error:", error);
    return res.status(500).json({ error: "Failed to fetch applications. Please try again." });
  }
});

// 3. PATCH /api/applications/:id/status - Update status of a specific application
router.patch("/applications/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return res.status(400).json({ error: "invalid_id: The provided ID is not a valid UUID format." });
    }

    // Validate status parameter
    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "invalid_status: Status must be either 'approved' or 'rejected'." });
    }

    const updatedApp = await updateApplicationStatus(id, status);
    if (!updatedApp) {
      return res.status(404).json({ error: "not_found: No application found with the specified ID." });
    }

    return res.json(updatedApp);
  } catch (error: any) {
    console.error("PATCH /applications/:id/status error:", error);
    return res.status(500).json({ error: "Failed to update application status." });
  }
});

// 4. GET /api/summary - Return aggregate stats for dashboard
router.get("/summary", async (req: Request, res: Response) => {
  try {
    const summary = await getSummary();
    return res.json(summary);
  } catch (error: any) {
    console.error("GET /summary error:", error);
    return res.status(500).json({ error: "Failed to retrieve aggregate application metrics." });
  }
});

export default router;
