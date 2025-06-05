/**
 * @swagger
 * tags:
 *   name: Payment Accounts
 *   description: Payment account management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentAccount:
 *       type: object
 *       required:
 *         - type
 *         - user
 *         - account
 *       properties:
 *         _id:
 *           type: string
 *           description: Payment account ID
 *         type:
 *           type: string
 *           enum: [braintree, stripe_customer, stripe_account]
 *           description: Type of payment account
 *         user:
 *           type: string
 *           description: ID of the user who owns the payment account
 *         account:
 *           type: object
 *           description: Payment provider specific account details
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaymentAccountResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaymentAccount'
 *         totalCount:
 *           type: integer
 *           description: Total number of payment accounts
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 */

/**
 * @swagger
 * /api/payment-account:
 *   get:
 *     summary: Get user's payment accounts
 *     tags: [Payment Accounts]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [braintree, stripe_customer, stripe_account]
 *         description: Filter by payment account type
 *     responses:
 *       200:
 *         description: List of payment accounts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentAccountResponse'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new payment account
 *     tags: [Payment Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - account
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [braintree, stripe_customer, stripe_account]
 *                 description: Type of payment account
 *               account:
 *                 type: object
 *                 description: Payment provider specific account details
 *     responses:
 *       200:
 *         description: Payment account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentAccount'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/payment-account/{paymentAccountId}:
 *   get:
 *     summary: Get payment account by ID
 *     tags: [Payment Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentAccountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment account ID
 *     responses:
 *       200:
 *         description: Payment account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentAccount'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment account not found
 *   put:
 *     summary: Update payment account
 *     tags: [Payment Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentAccountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account:
 *                 type: object
 *                 description: Updated payment provider specific account details
 *     responses:
 *       200:
 *         description: Payment account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentAccount'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment account not found
 *   delete:
 *     summary: Delete a payment account
 *     tags: [Payment Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentAccountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment account ID
 *     responses:
 *       200:
 *         description: Payment account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentAccount'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment account not found
 */
