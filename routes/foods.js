var express = require('express');
var router = express.Router();

var food = require('../models/food');
const foodCtrl = require('../controllers/FoodController');

/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: Food item management endpoints
 */

/**
 * @swagger
 * /api/food:
 *   get:
 *     summary: Get all food items
 *     tags: [Foods]
 *     responses:
 *       200:
 *         description: List of all food items
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
 *                   vegan:
 *                     type: boolean
 *                   vegetarian:
 *                     type: boolean
 */
router.get('/', foodCtrl.getAll);

/**
 * @swagger
 * /api/food/vegan:
 *   get:
 *     summary: Get all vegan food items
 *     tags: [Foods]
 *     responses:
 *       200:
 *         description: List of vegan food items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/vegan', foodCtrl.getAllVegan);

/**
 * @swagger
 * /api/food/Vegetarian:
 *   get:
 *     summary: Get all vegetarian food items
 *     tags: [Foods]
 *     responses:
 *       200:
 *         description: List of vegetarian food items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/Vegetarian', foodCtrl.getAllVegetarian);

/**
 * @swagger
 * /api/food/{id}:
 *   get:
 *     summary: Get food item by ID
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food item ID
 *     responses:
 *       200:
 *         description: Food item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 vegan:
 *                   type: boolean
 *                 vegetarian:
 *                   type: boolean
 *       404:
 *         description: Food item not found
 */
router.get('/:id', foodCtrl.getById);

module.exports = router;