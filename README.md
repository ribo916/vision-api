# VisionFI Proxy Playground

A lightweight Express.js server that wraps the VisionFI SDK into simple web API endpoints. Includes a browser-based UI to test document uploads, analysis, and result retrieval directly without needing Postman or other external tools.

Built for easier hands-on exploration and validation of VisionFI workflows.

---

## 🚀 Overview

This project provides a lightweight, secure API for:

- Authenticating VisionFI service accounts
- Submitting invoices for automatic document analysis
- Submitting government IDs for verification (optional future endpoint)
- Retrieving structured extraction results
- Interactive API docs via Swagger UI

---

## 🛠 Tech Stack

- Node.js (ESModules)
- Express.js
- Swagger UI (for API documentation)
- Multer (for file uploads)
- Render.com (deployment)

---

## 📚 Available Endpoints

| Method | Endpoint | Purpose |
|:---|:---|:---|
| `GET` | `/auth/test` | Test VisionFI authentication |
| `POST` | `/analyze/invoice` | Submit an invoice PDF using the `auto_invoice_processing` workflow |
| `POST` | `/analyze/id` | (Coming soon) Submit a government ID document |
| `GET` | `/results/:uuid` | Retrieve analysis results by UUID |
| `GET` | `/docs` | View Swagger API documentation |

---

## 🔒 Environment Variables

You must configure the following environment variables:

| Key | Purpose |
|:---|:---|
| `VISIONFI_CREDENTIALS` | Stringified JSON of your VisionFI service account credentials |

Example `.env`:

```env
VISIONFI_CREDENTIALS={...your service account JSON here...}
