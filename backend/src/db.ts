import pg from "pg";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables early for database initialization
dotenv.config();

const { Pool } = pg;

export interface Application {
  id: string;
  name: string;
  mobile: string;
  amount: number;
  purpose: string;
  language: "Hindi" | "Tamil" | "Telugu" | "Marathi" | "English";
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface Summary {
  total: number;
  totalAmount: number;
  byStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
}

// Check database configuration
const databaseUrl = process.env.DATABASE_URL;
let pool: pg.Pool | null = null;
let useFallback = true;

// Attempt to initialize PG Pool if connection string is configured
if (databaseUrl) {
  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false, // Useful for self-signed certificates in Supabase/Neon/Render
      },
      connectionTimeoutMillis: 5000,
    });
    console.log("PostgreSQL Pool initialized successfully with configurations.");
    useFallback = false;
  } catch (error) {
    console.error("Failed to initialize PostgreSQL pool:", error);
    useFallback = true;
  }
} else {
  console.log("No DATABASE_URL found in environment. Falling back to local JSON persistence.");
}

// Setup local JSON file storage path for fallback mode
const DATA_DIR = path.join(process.cwd(), "backend", "data");
const DATA_FILE = path.join(DATA_DIR, "applications.json");

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Load applications from fallback database
function loadFallbackApplications(): Application[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      ensureDirectoryExistence(DATA_FILE);
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(rawData);
  } catch (err) {
    console.error("Error loading JSON fallback data:", err);
    return [];
  }
}

// Write applications to fallback database
function saveFallbackApplications(apps: Application[]) {
  try {
    ensureDirectoryExistence(DATA_FILE);
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2));
  } catch (err) {
    console.error("Error saving JSON fallback data:", err);
  }
}

// Database helper functions bridging Postgres and JSON local file persistence
export async function getApplications(statusFilter?: string): Promise<Application[]> {
  if (!useFallback && pool) {
    try {
      let query = "SELECT id, name, mobile, amount::float as amount, purpose, language, status, created_at FROM applications";
      const params: any[] = [];
      
      if (statusFilter && ["pending", "approved", "rejected"].includes(statusFilter)) {
        query += " WHERE status = $1";
        params.push(statusFilter);
      }
      
      query += " ORDER BY created_at DESC";
      
      const res = await pool.query(query, params);
      return res.rows;
    } catch (err) {
      console.error("PostgreSQL select query failed. Attempting local storage rollback.", err);
      // Fallback in-case PostgreSQL connection drops at runtime
    }
  }

  // Local file-based fallback retrieval
  let apps = loadFallbackApplications();
  if (statusFilter && ["pending", "approved", "rejected"].includes(statusFilter)) {
    apps = apps.filter((app) => app.status === statusFilter);
  }
  return apps.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createApplication(data: {
  name: string;
  mobile: string;
  amount: number;
  purpose: string;
  language: "Hindi" | "Tamil" | "Telugu" | "Marathi" | "English";
}): Promise<Application> {
  if (!useFallback && pool) {
    try {
      const query = `
        INSERT INTO applications (name, mobile, amount, purpose, language)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, mobile, amount::float as amount, purpose, language, status, created_at
      `;
      const values = [data.name, data.mobile, data.amount, data.purpose, data.language];
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("PostgreSQL insert query failed. Saving to local storage fallback instead.", err);
    }
  }

  // Local fallback creation
  const apps = loadFallbackApplications();
  const newApp: Application = {
    id: uuidv4(),
    name: data.name,
    mobile: data.mobile,
    amount: data.amount,
    purpose: data.purpose,
    language: data.language,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  apps.push(newApp);
  saveFallbackApplications(apps);
  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<Application | null> {
  if (!useFallback && pool) {
    try {
      const query = `
        UPDATE applications
        SET status = $1
        WHERE id = $2
        RETURNING id, name, mobile, amount::float as amount, purpose, language, status, created_at
      `;
      const res = await pool.query(query, [status, id]);
      if (res.rowCount === 0) {
        return null;
      }
      return res.rows[0];
    } catch (err) {
      console.error("PostgreSQL update status failed. Modifying local database fallback instead.", err);
    }
  }

  // Local fallback update
  const apps = loadFallbackApplications();
  const appIndex = apps.findIndex((a) => a.id === id);
  if (appIndex === -1) {
    return null;
  }
  apps[appIndex].status = status;
  saveFallbackApplications(apps);
  return apps[appIndex];
}

export async function getSummary(): Promise<Summary> {
  if (!useFallback && pool) {
    try {
      const query = `
        SELECT
          COUNT(*)::int as total,
          COALESCE(SUM(amount), 0)::float as total_amount,
          COUNT(*) FILTER (WHERE status = 'pending')::int as pending_count,
          COUNT(*) FILTER (WHERE status = 'approved')::int as approved_count,
          COUNT(*) FILTER (WHERE status = 'rejected')::int as rejected_count
        FROM applications;
      `;
      const res = await pool.query(query);
      const row = res.rows[0];
      return {
        total: row.total,
        totalAmount: row.total_amount,
        byStatus: {
          pending: row.pending_count,
          approved: row.approved_count,
          rejected: row.rejected_count,
        },
      };
    } catch (err) {
      console.error("PostgreSQL summary aggregation failed. Computing from JSON data instead.", err);
    }
  }

  // Local fallback summary aggregation
  const apps = loadFallbackApplications();
  const total = apps.length;
  const totalAmount = apps.reduce((sum, app) => sum + app.amount, 0);
  const pending = apps.filter((a) => a.status === "pending").length;
  const approved = apps.filter((a) => a.status === "approved").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;

  return {
    total,
    totalAmount,
    byStatus: {
      pending,
      approved,
      rejected,
    },
  };
}

export function isUsingFallback(): boolean {
  return useFallback;
}
