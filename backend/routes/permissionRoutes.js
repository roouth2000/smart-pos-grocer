const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of permissions
 *   post:
 *     summary: Create a permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - group_name
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               group_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Permission created
 */
router.route('/')
    .get(permissionController.getAllPermissions)
    .post(permissionController.createPermission);

module.exports = router;
