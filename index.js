import express from "express";
import fs from "fs-extra";
import { createWorker } from "tesseract.js";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json({ limit: "10mb" }));

// Cache worker per language
const workers = new Map();

async function getWorker(lang) {
  if (workers.has(lang)) {
    return workers.get(lang);
  }

  console.log(`Creating OCR worker for language: ${lang}`);

  const worker = await createWorker({
    lang,
    logger: m => console.log(`[OCR ${lang}]`, m.status),
  });

  workers.set(lang, worker);
  return worker;
}

app.post("/ocr", async (req, res) => {
  try {
    const { base64, lang = "eng" } = req.body;

    if (!base64) {
      return res.status(400).json({ error: "base64 image required" });
    }

    // Remove data:image/...;base64,
    const cleanBase64 = base64.includes(",")
      ? base64.split(",")[1]
      : base64;

    const buffer = Buffer.from(cleanBase64, "base64");
    const filename = `/tmp/${uuid()}.png`;

    await fs.writeFile(filename, buffer);

    const worker = await getWorker(lang);

    const {
      data: { text },
    } = await worker.recognize(filename);

    await fs.remove(filename);

    res.json({
      lang,
      text: text.trim(),
    });
  } catch (err) {
    console.error("OCR ERROR:", err);
    res.status(500).json({ error: "OCR failed" });
  }
});

app.listen(6103, () => {
  console.log("OCR API running on port 6103");
});
