const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
app.use(bodyParser.json()); // Parses incoming JSON requests

app.use('/products', productRoutes); // Mount product-related routes
app.use('/cart', cartRoutes);       // Mount cart-related routes

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
