import express from "express";
import fs from "fs-extra";
import { execFile } from "child_process";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 6103;

app.use(express.json({ limit: "10mb" }));

// Authentication Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  if (token !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};

// Health check endpoint (no auth required)
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Apply authentication to /ocr endpoint
app.post("/ocr", authenticate, async (req, res) => {
  try {
    const { base64, lang = "eng" } = req.body;
    if (!base64) return res.status(400).json({ error: "base64 required" });

    const buffer = Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const input = `/tmp/${uuid()}.png`;
    const output = `/tmp/${uuid()}`;

    await fs.writeFile(input, buffer);

    execFile(
      "tesseract",
      [input, output, "-l", lang],
      async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "OCR failed" });
        }

        const text = await fs.readFile(`${output}.txt`, "utf8");

        await fs.remove(input);
        await fs.remove(`${output}.txt`);

        res.json({ text });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "OCR failed" });
  }
});

app.listen(PORT, () => console.log(`OCR API running on ${PORT}`));
