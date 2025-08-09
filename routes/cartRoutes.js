const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController'); //imports the logic for cart operations

router.get('/', cartController.viewCart); // Returns the current contents of the cart, including product details and total cost
router.post('/add', cartController.addItem);// Adds a new product to the cart — body contains productId and quantity
router.put('/update/:id', cartController.updateQuantity); // Updates the quantity of a specific cart item — :id is the cart item ID, not the product ID
router.delete('/remove/:id', cartController.removeItem); // Completely removes an item from the cart by its cart item ID


module.exports = router;
