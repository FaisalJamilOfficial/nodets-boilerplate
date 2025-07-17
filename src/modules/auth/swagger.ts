/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User and admin authentication and authorization endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         name:
 *           type: string
 *           description: User's full name
 *     AdminRegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Admin's email address
 *         password:
 *           type: string
 *           format: password
 *           description: Admin's password
 *         type:
 *           type: string
 *           enum: [standard, super_admin]
 *           description: Admin type (defaults to standard)
 *     SocialLoginRequest:
 *       type: object
 *       properties:
 *         googleId:
 *           type: string
 *           description: Google ID for Google login
 *         facebookId:
 *           type: string
 *           description: Facebook ID for Facebook login
 *     PasswordResetRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *     PasswordResetConfirm:
 *       type: object
 *       required:
 *         - password
 *         - user
 *         - token
 *       properties:
 *         password:
 *           type: string
 *           format: password
 *           description: New password
 *         user:
 *           type: string
 *           description: User ID
 *         token:
 *           type: string
 *           description: Reset token
 *     LogoutRequest:
 *       type: object
 *       properties:
 *         device:
 *           type: string
 *           description: Device identifier to logout from
 *     TokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Operation status message
 *           example: Operation completed successfully!
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Invalid input data or user already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login as user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Missing login credentials
 *       401:
 *         description: Invalid password
 *       403:
 *         description: Account is not active
 *       404:
 *         description: Account not registered
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */

/**
 * @swagger
 * /api/auth/password/email:
 *   post:
 *     summary: Request password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetRequest'
 *     responses:
 *       200:
 *         description: Reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: User with given email doesn't exist
 *   put:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetConfirm'
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid link, token, or user ID
 */

/**
 * @swagger
 * /api/auth/login/phone:
 *   post:
 *     summary: Login with phone number (requires OTP verification)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Phone login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Unauthorized - Invalid token or OTP
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/login/google:
 *   post:
 *     summary: Login with Google ID
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - googleId
 *             properties:
 *               googleId:
 *                 type: string
 *                 description: Google ID for authentication
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       404:
 *         description: User with Google ID not found
 */

/**
 * @swagger
 * /api/auth/login/facebook:
 *   post:
 *     summary: Login with Facebook ID
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - facebookId
 *             properties:
 *               facebookId:
 *                 type: string
 *                 description: Facebook ID for authentication
 *     responses:
 *       200:
 *         description: Facebook login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       404:
 *         description: User with Facebook ID not found
 */

/**
 * @swagger
 * /api/auth/login/admin:
 *   post:
 *     summary: Login as admin
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Admin login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Missing login credentials
 *       401:
 *         description: Invalid password
 *       403:
 *         description: Account is not active
 *       404:
 *         description: Admin account not registered
 */

/**
 * @swagger
 * /api/auth/register/admin:
 *   post:
 *     summary: Register a new admin (requires API key)
 *     tags: [Authentication]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminRegisterRequest'
 *     responses:
 *       200:
 *         description: Admin registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Invalid input data or admin already exists
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *       500:
 *         description: Internal server error
 */
