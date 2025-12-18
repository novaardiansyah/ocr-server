import express from "express";
import fs from "fs-extra";
import { createWorker } from "tesseract.js";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/ocr", async (req, res) => {
  const worker = null;

  try {
    const { base64, lang = "eng" } = req.body;

    if (!base64) {
      return res.status(400).json({ error: "base64 image required" });
    }

    console.log(`[OCR] language: ${lang}`);

    // clean base64 header if exists
    const imageBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(imageBase64, "base64");

    const filename = `/tmp/${uuid()}.png`;
    await fs.writeFile(filename, buffer);

    const worker = await createWorker({
      lang,
      logger: m => console.log(`[OCR ${lang}]`, m.status),
    });

    const {
      data: { text },
    } = await worker.recognize(filename);

    await worker.terminate();
    await fs.remove(filename);

    res.json({ text });

  } catch (err) {
    console.error(err);
    if (worker) await worker.terminate();
    res.status(500).json({ error: "OCR failed" });
  }
});

app.listen(6103, () => {
  console.log("OCR API running on port 6103");
});
