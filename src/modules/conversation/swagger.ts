/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Conversation management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Conversation ID
 *         userTo:
 *           type: string
 *           description: ID of the user receiving the conversation
 *         userFrom:
 *           type: string
 *           description: ID of the user initiating the conversation
 *         lastMessage:
 *           type: string
 *           description: ID of the last message in the conversation
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *           description: Current status of the conversation
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ConversationResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *               lastMessage:
 *                 type: object
 *                 properties:
 *                   text:
 *                     type: string
 *                   userFrom:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   attachments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *         totalCount:
 *           type: integer
 *           description: Total number of conversations
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 */

/**
 * @swagger
 * /api/conversation:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userTo
 *             properties:
 *               userTo:
 *                 type: string
 *                 description: ID of the user to start conversation with
 *     responses:
 *       200:
 *         description: Conversation created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Invalid input or conversation request rejected
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get user's conversations
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword for messages or user names
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConversationResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/conversation/{conversationId}:
 *   get:
 *     summary: Get conversation by ID
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Invalid conversation ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
