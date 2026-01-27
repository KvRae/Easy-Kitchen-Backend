const express = require('express');
const router = express.Router();

const area = require('../models/area');
const areaCtrl = require('../controllers/AreaController');

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: Geographical area management endpoints
 */

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Get all geographical areas
 *     tags: [Areas]
 *     responses:
 *       200:
 *         description: List of all areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get('/', areaCtrl.getAll);

/**
 * @swagger
 * /api/areas/{id}:
 *   get:
 *     summary: Get area by ID
 *     tags: [Areas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *     responses:
 *       200:
 *         description: Area details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Area not found
 */
router.get('/:id', areaCtrl.getById);

module.exports = router;