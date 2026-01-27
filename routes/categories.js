var express = require('express');
var router = express.Router();

var Cat = require('../models/category');
const CatCtrl = require('../controllers/CategoryController');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Recipe category endpoints
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
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
router.get('/', CatCtrl.getAll);

module.exports = router;