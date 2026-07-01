/**
 * Production static file server — no Vite dependency.
 * Kept separate from vite.ts so Vite is never loaded in production.
 */
import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In production dist/index.js lives in dist/ so "public" resolves to dist/public
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `[static] Build directory not found: ${distPath}. Run pnpm build first.`
    );
  } else {
    console.log(`[static] Serving from: ${distPath}`);
  }

  app.use(express.static(distPath));

  // Fall through to index.html for client-side routing
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
