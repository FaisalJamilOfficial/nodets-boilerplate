/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Conversation management endpoints (handled through message routes)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       required:
 *         - userTo
 *         - userFrom
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
 *                     description: User ID
 *                   name:
 *                     type: string
 *                     description: User's name
 *                   image:
 *                     type: string
 *                     description: User's profile image
 *               lastMessage:
 *                 type: object
 *                 properties:
 *                   text:
 *                     type: string
 *                     description: Last message text
 *                   userFrom:
 *                     type: string
 *                     description: ID of the message sender
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Message creation timestamp
 *                   attachments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           description: Attachment type
 *         totalCount:
 *           type: integer
 *           description: Total number of conversations
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *     CreateConversationRequest:
 *       type: object
 *       required:
 *         - userTo
 *         - text
 *       properties:
 *         userTo:
 *           type: string
 *           description: ID of the user to start conversation with
 *         text:
 *           type: string
 *           description: Initial message text
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: Path to the attachment file
 *               type:
 *                 type: string
 *                 description: Type of the attachment
 */

/**
 * @swagger
 * /api/message/conversation:
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
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
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
 *         description: Unauthorized - Invalid or missing token
 */

/**
 * @swagger
 * /api/message:
 *   post:
 *     summary: Send a message and create/update conversation
 *     description: Sends a message and automatically creates or updates the conversation between users
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userTo
 *               - text
 *             properties:
 *               userTo:
 *                 type: string
 *                 description: ID of the user to send message to
 *               text:
 *                 type: string
 *                 description: Message text content
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Message attachments (up to 8 files)
 *     responses:
 *       200:
 *         description: Message sent and conversation created/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Message ID
 *                 conversation:
 *                   type: string
 *                   description: Conversation ID
 *                 userTo:
 *                   type: string
 *                   description: Recipient user ID
 *                 userFrom:
 *                   type: string
 *                   description: Sender user ID
 *                 text:
 *                   type: string
 *                   description: Message text
 *                 attachments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                       type:
 *                         type: string
 *                 status:
 *                   type: string
 *                   enum: [unread, read, deleted]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input data or conversation request rejected
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Recipient user not found
 */
