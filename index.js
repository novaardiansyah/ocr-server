import express from "express";
import fs from "fs-extra";
import { execFile } from "child_process";
import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/ocr", async (req, res) => {
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

app.listen(6103, () => console.log("OCR API running on 6103"));
