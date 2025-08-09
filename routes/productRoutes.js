const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAll); // Fetches all products from the database, no filters applied
router.post('/', productController.create);  //adds a new product, expects full product data in the request body
router.put('/:id', productController.update); // Updates a product's details based on its ID
router.delete('/:id', productController.remove); // Removes a product from the database entirely based on its ID

module.exports = router;
