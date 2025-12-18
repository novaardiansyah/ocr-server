import express from "express";
import fs from "fs-extra";
import { createWorker } from "tesseract.js";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json({ limit: "10mb" }));

const worker = await createWorker("eng");

app.post("/ocr", async (req, res) => {
  try {
    const { base64, lang = "eng" } = req.body;

    if (!base64) {
      return res.status(400).json({ error: "base64 image required" });
    }

    const buffer = Buffer.from(base64, "base64");
    const filename = `/tmp/${uuid()}.png`;

    await fs.writeFile(filename, buffer);

    await worker.loadLanguage(lang);
    await worker.initialize(lang);

    const {
      data: { text },
    } = await worker.recognize(filename);

    await fs.remove(filename);

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OCR failed" });
  }
});

app.listen(6103, () => {
  console.log("OCR API running on port 6103");
});
