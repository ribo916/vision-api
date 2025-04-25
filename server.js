import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import visionfi from 'visionfi';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

dotenv.config(); // Load environment variables from .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer({ dest: 'uploads/' });


const serverUrl = process.env.NODE_ENV === 'production'
  ? 'https://vision-api-ssnv.onrender.com'
  : 'http://localhost:3000';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'VisionFI API Proxy',
    version: '1.0.0',
    description: 'Simple Express API that wraps the VisionFI SDK for document analysis'
  },
  servers: [
    {
      url: serverUrl,
      description: 'Dynamic server based on environment'
    }
  ]
};
  
const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, 'server.js')] // not './server.js'
};
  

const swaggerSpec = swaggerJSDoc(options);
const { VisionFi } = visionfi;
const app = express();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT || 3000;
const serviceAccountJson = JSON.parse(
  fs.readFileSync(process.env.VISIONFI_CREDENTIALS_PATH, 'utf-8')
);

const client = new VisionFi({
  serviceAccountJson
});

/**
 * @swagger
 * /auth/test:
 *   get:
 *     summary: Test VisionFI authentication
 *     description: Returns success if VisionFI service account is valid.
 *     responses:
 *       200:
 *         description: Authentication successful
 *       500:
 *         description: Authentication failed
 */
app.get('/auth/test', async (req, res) => {
  try {
    const authResult = await client.verifyAuth();
    res.status(200).json({
      message: 'Authentication successful!',
      data: authResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /analyze/invoice:
 *   post:
 *     summary: Analyze an invoice document
 *     description: Upload a PDF file to analyze using the 'auto_invoice_processing' workflow. This endpoint is hardcoded to the invoice workflow type.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to be analyzed
 *     responses:
 *       200:
 *         description: Analysis started successfully, returns job UUID
 *       400:
 *         description: No file uploaded or bad request
 *       500:
 *         description: Error processing the document
 */
app.post('/analyze/invoice', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = req.file.originalname;

    const result = await client.analyzeDocument(fileBuffer, {
      fileName,
      analysisType: 'auto_invoice_processing'
    });

    res.status(200).json({
      message: 'Invoice analysis started',
      jobUUID: result.uuid
    });
  } catch (error) {
    console.error('Invoice analysis error:', error.message);
    res.status(500).json({
      message: 'Error analyzing invoice',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /results/{uuid}:
 *   get:
 *     summary: Retrieve document analysis results
 *     description: Fetches the results for a given document analysis job by UUID.
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         description: UUID of the document analysis job
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved analysis results
 *       404:
 *         description: Job not found or results not ready
 *       500:
 *         description: Error retrieving results
 */
app.get('/results/:uuid', async (req, res) => {
    try {
      const { uuid } = req.params;
  
      const result = await client.getResults(uuid, 3000, 20); // Optional polling setup
  
      res.status(200).json({
        message: 'Results retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Results retrieval error:', error.message);
      res.status(500).json({
        message: 'Error retrieving results',
        error: error.message
      });
    }
});
  
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
