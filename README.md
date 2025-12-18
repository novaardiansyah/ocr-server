# Tesseract OCR Server

Hi Future Developer,

Welcome to the **Tesseract OCR Server**! This project is a simple and efficient OCR (Optical Character Recognition) API server built with Node.js and Express.js, powered by Tesseract OCR engine.

This server allows you to extract text from images by sending base64-encoded image data through a REST API. It's designed for easy integration with other applications that need OCR capabilities.

## Dazzling Tech Stack! ⚡

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [uuid](https://www.npmjs.com/package/uuid)

## Sneak Peek 🌟

Want to try the demo? You can test the OCR API at:

**Demo Endpoint:** `POST https://ocr-server.novadev.my.id/ocr`

To get an API key, please reach out through the contact section below. I'll be happy to provide you with access!

## Installation Guide 🛠️

### Prerequisites

Before running this project, you need to install Tesseract OCR on your system.

#### Ubuntu 22.04

```bash
sudo apt update
sudo apt install -y tesseract-ocr tesseract-ocr-eng
```

Verify the installation:

```bash
tesseract --version
```

### Project Setup

1. **Clone the repository**

```bash
git clone https://github.com/novaardiansyah/ocr-server.git
cd ocr-server
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file and set your configuration:

```env
API_KEY=your_secure_api_key_here
PORT=3000
```

4. **Run the server**

```bash
node index.js
```

The server will start on the configured port (default: 3000).

### Running with PM2 (Production)

For production deployment, you can use PM2 process manager:

```bash
npm run pm2:start
```

Other PM2 commands:

```bash
npm run pm2:stop     # Stop the server
npm run pm2:restart  # Restart the server
npm run pm2:delete   # Delete the PM2 process
```

## API Documentation 📚

### Health Check

Check if the server is running.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-12-18T17:49:12.342Z"
}
```

### OCR - Extract Text from Image

Extract text from a base64-encoded image using Tesseract OCR.

**Endpoint:** `POST /ocr`

**Authentication:** Bearer Token required

**Headers:**

```
Authorization: Bearer your_api_key_here
Content-Type: application/json
```

**Request Body:**

```json
{
  "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/...",
  "lang": "eng"
}
```

| Parameter | Type   | Required | Description                                      |
|-----------|--------|----------|--------------------------------------------------|
| base64    | string | Yes      | Base64-encoded image data                        |
| lang      | string | No       | Language code for OCR (default: "eng")           |

**Response:**

```json
{
  "text": "<your_result_text>"
}
```

**Error Responses:**

- `400 Bad Request` - Missing base64 parameter
- `401 Unauthorized` - Missing or invalid authorization header
- `403 Forbidden` - Invalid API key
- `500 Internal Server Error` - OCR processing failed

## Credits 🙏

This project is powered by the amazing [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) engine, an open-source OCR engine. Tesseract is licensed under the [Apache License 2.0](https://github.com/tesseract-ocr/tesseract?tab=Apache-2.0-1-ov-file).

## Licensing Groove 🕺

Exciting news! This project is grooving to the rhythm of the [MIT License](LICENSE).

Feel free to use, modify, and share it with the world. Just remember to keep the original license intact. Let's spread the joy of coding together! 🚀

## Code of Conduct 🤝

We believe in fostering a welcoming and inclusive environment for everyone. Please be respectful, considerate, and constructive in all interactions. By participating in this project, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Let's collaborate and make this community awesome together!

## Let's Connect! 📞

Need to chat? Feel free to drop me a line via [Email](mailto:novaardiansyah78@gmail.com) or hit me up on [WhatsApp](https://wa.me/6289506668480?text=Hi%20Nova,%20I%20have%20a%20question%20about%20your%20project%20on%20GitHub:%20https://github.com/novaardiansyah/ocr-server). I'm just a message away, ready to groove with you! 📩

## Project Status 🚀

![stages](https://img.shields.io/badge/stages-development-informational)
[![information](https://img.shields.io/badge/information-references-informational)](references.json)
![size](https://img.shields.io/github/repo-size/novaardiansyah/ocr-server?label=size&color=informational)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![last commit](https://img.shields.io/github/last-commit/novaardiansyah/ocr-server?label=last%20commit&color=informational)](commits/main)

---

**Happy coding and collaborating!**
— Nova Ardiansyah