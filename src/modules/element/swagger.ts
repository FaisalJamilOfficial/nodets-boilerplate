/**
 * @swagger
 * tags:
 *   name: Elements
 *   description: Element management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Element:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Element ID
 *     ElementResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Element'
 *         totalCount:
 *           type: integer
 *           description: Total number of elements
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 */

/**
 * @swagger
 * /api/element:
 *   get:
 *     summary: Get all elements
 *     tags: [Elements]
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
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of elements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ElementResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/element/admin:
 *   post:
 *     summary: Create a new element
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Element'
 *     responses:
 *       200:
 *         description: Element created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   put:
 *     summary: Update an element
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: element
 *         required: true
 *         schema:
 *           type: string
 *         description: Element ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Element'
 *     responses:
 *       200:
 *         description: Element updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Element not found
 *   get:
 *     summary: Get all elements (admin)
 *     tags: [Elements]
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
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of elements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ElementResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   delete:
 *     summary: Delete an element
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: element
 *         required: true
 *         schema:
 *           type: string
 *         description: Element ID
 *     responses:
 *       200:
 *         description: Element deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Element not found
 */

/**
 * @swagger
 * /api/element/{elementId}:
 *   get:
 *     summary: Get element by ID
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: elementId
 *         required: true
 *         schema:
 *           type: string
 *         description: Element ID
 *     responses:
 *       200:
 *         description: Element details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Element not found
 */
