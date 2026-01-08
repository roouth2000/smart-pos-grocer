const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles with permissions
 *   post:
 *     summary: Create a role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Permission IDs
 *     responses:
 *       201:
 *         description: Role created
 */
router.route('/')
    .get(roleController.getAllRoles)
    .post(roleController.createRole);

module.exports = router;
