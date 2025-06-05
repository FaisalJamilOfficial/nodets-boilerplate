/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/clean/DB:
 *   delete:
 *     summary: Clean database
 *     description: Delete all data from the database (requires admin privileges and API key)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Database cleaned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Operation completed successfully!
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       400:
 *         description: Bad Request - Invalid API key
 */
