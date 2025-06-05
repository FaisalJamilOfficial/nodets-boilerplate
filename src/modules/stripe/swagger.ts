/**
 * @swagger
 * tags:
 *   name: Stripe
 *   description: Stripe payment integration endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TransferRequest:
 *       type: object
 *       required:
 *         - user
 *         - amount
 *       properties:
 *         user:
 *           type: string
 *           description: ID of the user to transfer funds to
 *         amount:
 *           type: number
 *           description: Amount to transfer in cents
 *         description:
 *           type: string
 *           description: Description of the transfer
 *     AccountLinkRequest:
 *       type: object
 *       required:
 *         - account
 *       properties:
 *         account:
 *           type: string
 *           description: Stripe account ID
 *     WebhookEvent:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Status message
 *         event:
 *           type: object
 *           description: Stripe webhook event data
 */

/**
 * @swagger
 * /api/stripe/transfers:
 *   post:
 *     summary: Create a transfer to a connected account
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferRequest'
 *     responses:
 *       200:
 *         description: Transfer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Stripe transfer ID
 *                 amount:
 *                   type: number
 *                   description: Transfer amount in cents
 *                 destination:
 *                   type: string
 *                   description: Destination account ID
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/stripe/account-link:
 *   post:
 *     summary: Create a Stripe account link for onboarding
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountLinkRequest'
 *     responses:
 *       200:
 *         description: Account link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL for Stripe onboarding
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/stripe/webhook/external-account:
 *   post:
 *     summary: Handle Stripe webhook events for external accounts
 *     tags: [Stripe]
 *     security:
 *       - stripeWebhook: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Raw Stripe webhook event data
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WebhookEvent'
 *       400:
 *         description: Invalid webhook signature
 *     securitySchemes:
 *       stripeWebhook:
 *         type: apiKey
 *         in: header
 *         name: stripe-signature
 *         description: Stripe webhook signature for verification
 */
