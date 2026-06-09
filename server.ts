import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import apiRouter from "./backend/src/routes/applications.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global middlewares
  app.use(cors());
  app.use(express.json());

  // Mount API endpoints first
  app.use("/api", apiRouter);

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting full-stack server in DEVELOPMENT mode with Vite integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting full-stack server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vitto Loans backend + frontend serving at: http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Express startup crashed:", err);
});
