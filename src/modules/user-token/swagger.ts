/**
 * @swagger
 * tags:
 *   name: User Tokens
 *   description: User token management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserToken:
 *       type: object
 *       required:
 *         - user
 *         - token
 *       properties:
 *         _id:
 *           type: string
 *           description: Token ID
 *         user:
 *           type: string
 *           description: Reference to user ID
 *         token:
 *           type: string
 *           description: Authentication token
 *         expireAt:
 *           type: string
 *           format: date-time
 *           description: Token expiration timestamp
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/user-token:
 *   post:
 *     summary: Create a new user token
 *     tags: [User Tokens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID
 *     responses:
 *       200:
 *         description: Token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserToken'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get user token
 *     tags: [User Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User token details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserToken'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Token not found
 */

/**
 * @swagger
 * /api/user-token/{tokenId}:
 *   get:
 *     summary: Get token by ID
 *     tags: [User Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID
 *     responses:
 *       200:
 *         description: Token details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserToken'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Token not found
 *   delete:
 *     summary: Delete a token
 *     tags: [User Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID
 *     responses:
 *       200:
 *         description: Token deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserToken'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Token not found
 */
