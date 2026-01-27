var express = require('express');
var router = express.Router();
const multer = require('multer');
const RecetteCtrl = require('../controllers/RecetteController');
const fs = require('fs');

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe management endpoints
 */

/* multer Configuration */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
  
      const recetteId = req.params.recetteId;
      const uploadDir = `./uploads/${recetteId}`;
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb({ message: "Unsupported File Format" }, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: fileFilter,
  });
  /* multer configuration end */

/**
 * @swagger
 * /api/recettes/upload/{recetteId}:
 *   put:
 *     summary: Upload recipe image
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recetteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG or PNG, max 1MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Unsupported file format or file too large
 */
router.put('/upload/:recetteId',upload.single('file'), RecetteCtrl.uploadImage);

/**
 * @swagger
 * /api/recettes/image/{recetteId}/{imageName}:
 *   get:
 *     summary: Get recipe image
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: recetteId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: imageName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image retrieved successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 */
router.get('/image/:recetteId/:imageName',RecetteCtrl.getImage)

/**
 * @swagger
 * /api/recettes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of all recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get('/', RecetteCtrl.getAll);

/**
 * @swagger
 * /api/recettes/bio:
 *   get:
 *     summary: Get all bio/organic recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of bio recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get('/bio', RecetteCtrl.getAllBio);

/**
 * @swagger
 * /api/recettes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', RecetteCtrl.getRecettebyid);

/**
 * @swagger
 * /api/recettes/{id}/comments:
 *   get:
 *     summary: Get all comments for a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Recipe not found
 */
router.get('/:id/comments', RecetteCtrl.getCommentsByRecette);

/**
 * @swagger
 * /api/recettes/{id}/recettes:
 *   get:
 *     summary: Get all recipes by user
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get('/:id/recettes', RecetteCtrl.getRecettesByUser);

/**
 * @swagger
 * /api/recettes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               area:
 *                 type: string
 *               bio:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', RecetteCtrl.add);

/**
 * @swagger
 * /api/recettes/{id}/like:
 *   post:
 *     summary: Like a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe liked successfully
 *       404:
 *         description: Recipe not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/like',RecetteCtrl.likeRecette)

/**
 * @swagger
 * /api/recettes/{id}/dislike:
 *   post:
 *     summary: Dislike a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe disliked successfully
 *       404:
 *         description: Recipe not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/dislike',RecetteCtrl.dislikeRecette)

/**
 * @swagger
 * /api/recettes/{id}:
 *   patch:
 *     summary: Update a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               area:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *       404:
 *         description: Recipe not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id', RecetteCtrl.edit);

/**
 * @swagger
 * /api/recettes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       404:
 *         description: Recipe not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', RecetteCtrl.delete);

module.exports = router;