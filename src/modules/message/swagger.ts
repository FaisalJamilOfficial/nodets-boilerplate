/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Attachment:
 *       type: object
 *       required:
 *         - key
 *         - type
 *       properties:
 *         key:
 *           type: string
 *           description: key of the attachment file
 *         type:
 *           type: string
 *           description: Type of the attachment (e.g., image, video, document)
 *     Message:
 *       type: object
 *       required:
 *         - conversation
 *         - userTo
 *         - userFrom
 *       properties:
 *         _id:
 *           type: string
 *           description: Message ID
 *         conversation:
 *           type: string
 *           description: ID of the conversation this message belongs to
 *         userTo:
 *           type: string
 *           description: ID of the message recipient
 *         userFrom:
 *           type: string
 *           description: ID of the message sender
 *         text:
 *           type: string
 *           description: Message text content
 *         status:
 *           type: string
 *           enum: [unread, read, deleted]
 *           description: Message status
 *         attachments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Attachment'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MessageResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *         totalCount:
 *           type: integer
 *           description: Total number of messages
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 */

/**
 * @swagger
 * /api/message:
 *   post:
 *     summary: Send a new message
 *     tags: [Messages]
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
 *               - text
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID of the recipient user
 *               text:
 *                 type: string
 *                 description: Message text content
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       description: Attachment key (filename or storage key)
 *                     type:
 *                       type: string
 *                       description: MIME type of the attachment
 *                 description: Message attachments (array of objects)
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: conversation
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
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
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/message/{messageId}:
 *   get:
 *     summary: Get message by ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 *   put:
 *     summary: Update message status
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [read, deleted]
 *                 description: New message status
 *     responses:
 *       200:
 *         description: Message status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */
