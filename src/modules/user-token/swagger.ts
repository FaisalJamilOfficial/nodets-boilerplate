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
