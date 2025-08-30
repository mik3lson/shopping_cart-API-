const db = require('../models/db'); // Import MySQL connection pool/instance


// Retrieve all cart items along with product details and calculate the cart total
exports.viewCart = (req, res) => {
  // SQL joins cart_items with products to get full item info (name, price)
  const sql = `
    SELECT ci.id, p.name, p.price, ci.quantity, (p.price * ci.quantity) AS subtotal
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err.message);
    // Calculate total from all subtotals then sends items and total to client
    const total = results.reduce((acc, item) => acc + item.subtotal, 0);
    res.json({ items: results, total });
  });
};

exports.addItem = (req, res) => {
  const { id, quantity } = req.body;
  const productId = id;

  // check available stock before adding to cart
  db.query(
    'SELECT stockLevel FROM products WHERE id=?',
    [productId],
    (err, results) =>{
      if (err) return res.status(500).send(err.message);
      

      if (results.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      const stockLevel = results[0].stockLevel;

      // Step 2: Compare stock with requested quantity
      if (quantity > stockLevel) {
        return res.status(400).json({ 
          error: `Only ${stockLevel} item(s) available in stock` 
        });
      }
  
  //parameters are validated before inserting into the cart to prevent SQL injection
  db.query(
    'INSERT INTO cart_items (productId, quantity) VALUES (?, ?)',
    [productId, quantity],
    (err, result) => {
      if (err) return res.status(500).send(err.message);

      //return to new cart item id on the frontend for reference
      res.json({ 
        id: result.insertId
      });
    }
      );

});
};

// Update the quantity of an existing cart item
exports.updateQuantity = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  db.query(
    'UPDATE cart_items SET quantity=? WHERE id=?',
    [quantity, id],
    (err) => {
      if (err) return res.status(500).send(err.message);
      // Respond with 200 OK if update is successful, 
      res.sendStatus(200);
    }
  );
};

// Remove an item from the cart
exports.removeItem = (req, res) => {
  const { id } = req.params;
  // Deletion is limited to the item with the given ID to avoid accidental mass deletions
  db.query('DELETE FROM cart_items WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err.message);
    // Respond with 200 OK if deletion is successful
    res.sendStatus(200);
  });
};
