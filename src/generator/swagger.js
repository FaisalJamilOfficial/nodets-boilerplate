// file imports
const {
  pluralize,
  toPascalCase,
  toCamelCase,
  getIndefiniteArticle,
} = require("./helper.js");

/**
 * Returns OpenAPI specification for a given module name.
 * @param {string} moduleName Name of the module
 * @returns {string} OpenAPI specification as a string
 */
module.exports = function getSwaggerContent(moduleName) {
  const indefiniteArticle = getIndefiniteArticle(moduleName);
  const camelCaseModuleName = toCamelCase(moduleName);
  const pascalCaseModuleName = toPascalCase(moduleName);
  const pluralPascalCaseModuleName = pluralize(pascalCaseModuleName);
  const pluralCamelCaseModuleName = pluralize(camelCaseModuleName);
  return `
  /**
 * @swagger
 * tags:
 *   name: ${pluralPascalCaseModuleName}
 *   description: ${pascalCaseModuleName} management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ${pascalCaseModuleName}:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ${pascalCaseModuleName} ID
 *     ${pascalCaseModuleName}Response:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/${pascalCaseModuleName}'
 *         totalCount:
 *           type: integer
 *           description: Total number of ${pluralCamelCaseModuleName}
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 */

/**
 * @swagger
 * /api/${camelCaseModuleName}:
 *   get:
 *     summary: Get all ${pluralCamelCaseModuleName}
 *     tags: [${pluralPascalCaseModuleName}]
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
 *         description: List of ${pluralCamelCaseModuleName}
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${pascalCaseModuleName}Response'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/${camelCaseModuleName}/admin:
 *   post:
 *     summary: Create a new ${camelCaseModuleName}
 *     tags: [${pluralPascalCaseModuleName}]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${pascalCaseModuleName}'
 *     responses:
 *       200:
 *         description: ${pascalCaseModuleName} created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${pascalCaseModuleName}'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   put:
 *     summary: Update ${indefiniteArticle} ${camelCaseModuleName}
 *     tags: [${pluralPascalCaseModuleName}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ${camelCaseModuleName}
 *         required: true
 *         schema:
 *           type: string
 *         description: ${pascalCaseModuleName} ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${pascalCaseModuleName}'
 *     responses:
 *       200:
 *         description: ${pascalCaseModuleName} updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${pascalCaseModuleName}'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: ${pascalCaseModuleName} not found
 *   patch:
 *     summary: Update ${camelCaseModuleName} status (soft delete)
 *     description: Update the soft delete status of an ${camelCaseModuleName}. This endpoint is used to mark ${pluralCamelCaseModuleName} as deleted or restore them.
 *     tags: [${pluralPascalCaseModuleName}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ${camelCaseModuleName}
 *         required: true
 *         schema:
 *           type: string
 *         description: ${pluralCamelCaseModuleName} ID to update
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${pascalCaseModuleName}'
 *           examples:
 *             markDeleted:
 *               summary: Mark ${camelCaseModuleName} as deleted
 *               value:
 *                 isDeleted: true
 *             restore${pascalCaseModuleName}:
 *               summary: Restore deleted ${camelCaseModuleName}
 *               value:
 *                 isDeleted: false
 *     responses:
 *       200:
 *         description: ${pluralCamelCaseModuleName} status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${pluralCamelCaseModuleName}'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               title: "Sample ${pluralCamelCaseModuleName}"
 *               description: "This is a sample ${camelCaseModuleName} description"
 *               isDeleted: true
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T12:00:00.000Z"
 *       400:
 *         description: Invalid input data or ${camelCaseModuleName} ID
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: ${pluralCamelCaseModuleName} not found
 *   get:
 *     summary: Get all ${pluralCamelCaseModuleName} (admin)
 *     tags: [${pluralPascalCaseModuleName}]
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
 *       - in: query
 *         name: isDeleted
 *         schema:
 *           type: boolean
 *         description: Filter ${pluralCamelCaseModuleName} by deletion status (true for deleted, false for active, omit for all)
 *         example: false
 *     responses:
 *       200:
 *         description: List of ${pluralCamelCaseModuleName}
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${pascalCaseModuleName}Response'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   delete:
 *     summary: Delete ${indefiniteArticle} ${camelCaseModuleName}
 *     tags: [${pluralPascalCaseModuleName}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ${camelCaseModuleName}
 *         required: true
 *         schema:
 *           type: string
 *         description: ${pascalCaseModuleName} ID
 *     responses:
 *       200:
 *         description: ${pascalCaseModuleName} deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${pascalCaseModuleName}'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: ${pascalCaseModuleName} not found
 */

/**
 * @swagger
 * /api/${camelCaseModuleName}/${camelCaseModuleName}Id:
 *   get:
 *     summary: Get ${camelCaseModuleName} by ID
 *     tags: [${pluralPascalCaseModuleName}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ${camelCaseModuleName}Id
 *         required: true
 *         schema:
 *           type: string
 *         description: ${pascalCaseModuleName} ID
 *     responses:
 *       200:
 *         description: ${pascalCaseModuleName} details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${pascalCaseModuleName}'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: ${pascalCaseModuleName} not found
 */
`;
};
