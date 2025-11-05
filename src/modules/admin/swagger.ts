/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           description: Admin ID
 *         email:
 *           type: string
 *           format: email
 *           description: Admin's email address
 *         password:
 *           type: string
 *           format: password
 *           description: Admin's password (hashed)
 *         type:
 *           type: string
 *           enum: [standard, super_admin]
 *           description: Admin type
 *         status:
 *           type: string
 *           enum: [active, deleted]
 *           description: Admin account status
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Last login timestamp
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/admin/profile:
 *   put:
 *     summary: Update current admin's profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated admin profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 */
