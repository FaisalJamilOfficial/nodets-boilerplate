/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - type
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: Notification ID
 *         type:
 *           type: string
 *           enum: [new_message]
 *           description: Type of notification
 *         text:
 *           type: string
 *           description: Notification text content
 *         message:
 *           type: string
 *           description: ID of the related message (if any)
 *         messenger:
 *           type: string
 *           description: ID of the user who triggered the notification
 *         user:
 *           type: string
 *           description: ID of the user who receives the notification
 *         status:
 *           type: string
 *           enum: [unread, read]
 *           description: Notification status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     NotificationResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *         totalCount:
 *           type: integer
 *           description: Total number of notifications
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 */

/**
 * @swagger
 * /api/user/notification:
 *   get:
 *     summary: Get user's notifications
 *     tags: [Notifications]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [unread, read]
 *         description: Filter by notification status
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationResponse'
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Operation completed successfully!
 *       401:
 *         description: Unauthorized
 */
