/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: Profile ID
 *         user:
 *           type: string
 *           description: ID of the user who owns the profile
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Profile'
 *         totalCount:
 *           type: integer
 *           description: Total number of profiles
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 */
