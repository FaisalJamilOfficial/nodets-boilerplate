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
