import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Agrotech Server is running" });
  });

  app.post("/api/soil-analysis", async (req, res) => {
    try {
      const { ph, n, p, k, oc } = req.body;
      if (!ph || !n || !p || !k || !oc) {
        return res.status(400).json({ error: "All soil parameters are required." });
      }
      
      // Audit Log
      console.log(`[AUDIT] Soil Analysis requested: pH:${ph}, N:${n}, P:${p}, K:${k}, OC:${oc}`);
      
      // Note: Actual AI generation is handled on frontend for platform compliance.
      res.json({ status: "logged", message: "Analysis parameters received and logged." });
    } catch (error) {
      res.status(500).json({ error: "Backend logging failed." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌱 Agrotech Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
