/**
 * @swagger
 * tags:
 *   name: System Endpoints
 */

/**
 * @swagger
 * /api/ping:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns 'OK' if the server is running.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK
 */

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Swagger UI documentation
 *     description: Serves the Swagger UI or redirects to the Postman documentation URL.
 *     tags: [System]
 *     responses:
 *       302:
 *         description: Redirect to Postman documentation (if configured)
 *       200:
 *         description: Swagger UI HTML page
 */

/**
 * @swagger
 * /api/upload/file:
 *   post:
 *     summary: Upload a single file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     parameters:
 *       - in: header
 *         name: api_key
 *         required: true
 *         schema:
 *           type: string
 *         description: API key for upload authorization
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
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filename:
 *                   type: string
 *                   description: Name of the uploaded file
 *                 mimetype:
 *                   type: string
 *                   description: MIME type of the uploaded file
 *                 size:
 *                   type: integer
 *                   description: Size of the uploaded file in bytes
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/upload/files:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   filename:
 *                     type: string
 *                     description: Name of the uploaded file
 *                   mimetype:
 *                     type: string
 *                     description: MIME type of the uploaded file
 *                   size:
 *                     type: integer
 *                     description: Size of the uploaded file in bytes
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
