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
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: Element ID
 *         title:
 *           type: string
 *           description: Element title
 *         description:
 *           type: string
 *           description: Element description (optional)
 *         isDeleted:
 *           type: boolean
 *           description: Soft delete flag
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Element creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Element last update timestamp
 *     CreateElementRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Element title
 *         description:
 *           type: string
 *           description: Element description (optional)
 *     UpdateElementRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Element title
 *         description:
 *           type: string
 *           description: Element description
 *     UpdateElementStatusRequest:
 *       type: object
 *       required:
 *         - isDeleted
 *       properties:
 *         isDeleted:
 *           type: boolean
 *           description: Soft delete status
 *     ElementResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: Element ID
 *               title:
 *                 type: string
 *                 description: Element title
 *               description:
 *                 type: string
 *                 description: Element description
 *               isDeleted:
 *                 type: boolean
 *                 description: Soft delete flag
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
 *     description: Retrieve a paginated list of elements. Requires user authentication token.
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword to filter elements
 *         example: "sample"
 *     responses:
 *       200:
 *         description: Successfully retrieved list of elements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ElementResponse'
 *             example:
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   title: "Sample Element"
 *                   description: "This is a sample element description"
 *                   isDeleted: false
 *               totalCount: 1
 *               totalPages: 1
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User access required
 */

/**
 * @swagger
 * /api/element/admin:
 *   post:
 *     summary: Create a new element
 *     description: Create a new element. Requires admin authentication token.
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateElementRequest'
 *           example:
 *             title: "Sample Element"
 *             description: "This is a sample element description"
 *     responses:
 *       200:
 *         description: Element created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "Sample Element"
 *               description: "This is a sample element description"
 *               isDeleted: false
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Invalid input data - Missing required fields or invalid format
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *   put:
 *     summary: Update an element
 *     description: Update an element's title and/or description. Requires admin authentication token.
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: element
 *         required: true
 *         schema:
 *           type: string
 *         description: Element ID to update
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateElementRequest'
 *           example:
 *             title: "Updated Element Title"
 *             description: "Updated element description"
 *     responses:
 *       200:
 *         description: Element updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "Updated Element Title"
 *               description: "Updated element description"
 *               isDeleted: false
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T12:00:00.000Z"
 *       400:
 *         description: Invalid input data or element ID
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Element not found
 *   patch:
 *     summary: Update element status (soft delete)
 *     description: Update the soft delete status of an element. This endpoint is used to mark elements as deleted or restore them.
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: element
 *         required: true
 *         schema:
 *           type: string
 *         description: Element ID to update
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateElementStatusRequest'
 *           examples:
 *             markDeleted:
 *               summary: Mark element as deleted
 *               value:
 *                 isDeleted: true
 *             restoreElement:
 *               summary: Restore deleted element
 *               value:
 *                 isDeleted: false
 *     responses:
 *       200:
 *         description: Element status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "Sample Element"
 *               description: "This is a sample element description"
 *               isDeleted: true
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T12:00:00.000Z"
 *       400:
 *         description: Invalid input data or element ID
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Element not found
 *   get:
 *     summary: Get all elements (admin)
 *     description: Retrieve a paginated list of elements. Requires admin authentication token.
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword to filter elements
 *         example: "sample"
 *       - in: query
 *         name: isDeleted
 *         schema:
 *           type: boolean
 *         description: Filter elements by deletion status (true for deleted, false for active, omit for all)
 *         example: false
 *     responses:
 *       200:
 *         description: Successfully retrieved list of elements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ElementResponse'
 *             example:
 *               data:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   title: "Sample Element"
 *                   description: "This is a sample element description"
 *                   isDeleted: false
 *               totalCount: 1
 *               totalPages: 1
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *   delete:
 *     summary: Delete an element permanently
 *     description: Permanently delete an element from the database. This action cannot be undone. Requires admin authentication token.
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: element
 *         required: true
 *         schema:
 *           type: string
 *         description: Element ID to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Element deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "Deleted Element"
 *               description: "This element was deleted"
 *               isDeleted: false
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Invalid element ID
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Element not found
 */

/**
 * @swagger
 * /api/element/{element}:
 *   get:
 *     summary: Get element by ID
 *     description: Retrieve a single element by its ID. Requires admin authentication token.
 *     tags: [Elements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: element
 *         required: true
 *         schema:
 *           type: string
 *         description: Element ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Successfully retrieved element details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Element'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "Sample Element"
 *               description: "This is a sample element description"
 *               isDeleted: false
 *       400:
 *         description: Invalid element ID format
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Element not found
 */
