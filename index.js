const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json({ limit: "10mb" }));

app.post("/ocr", async (req, res) => {
  try {
    const { image_base64, lang = "eng" } = req.body;

    if (!image_base64) {
      return res.status(400).json({ error: "image_base64 required" });
    }

    const id = uuidv4();
    const imagePath = `uploads/${id}.png`;
    const outputPath = `uploads/${id}`;

    // Decode base64 → image file
    const buffer = Buffer.from(image_base64, "base64");
    fs.writeFileSync(imagePath, buffer);

    // Run tesseract
    exec(
      `tesseract ${imagePath} ${outputPath} -l ${lang}`,
      (err) => {
        if (err) {
          return res.status(500).json({ error: "OCR failed" });
        }

        const text = fs.readFileSync(`${outputPath}.txt`, "utf8");

        // Cleanup
        fs.unlinkSync(imagePath);
        fs.unlinkSync(`${outputPath}.txt`);

        res.json({ text });
      }
    );
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(6103, () => {
  console.log("OCR API running on port 6103");
});
