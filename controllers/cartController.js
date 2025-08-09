const db = require('../models/db'); // Import MySQL connection pool/instance


// Retrieve all cart items along with product details and calculate the cart total
exports.viewCart = (req, res) => {
  // SQL joins cart_items with products to get full item info (name, price)
  // Calculates subtotal for each row directly in SQL for efficiency
  const sql = `
    SELECT ci.id, p.name, p.price, ci.quantity, (p.price * ci.quantity) AS subtotal
    FROM cart_items ci
    JOIN products p ON ci.productId = p.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    // Calculate total from all subtotals then sends items and total to client
    const total = results.reduce((acc, item) => acc + item.subtotal, 0);
    res.json({ items: results, total });
  });
};

exports.addItem = (req, res) => {
  const { productId, quantity } = req.body;

  //parameters are validated before inserting into the cart to prevent SQL injection
  db.query(
    'INSERT INTO cart_items (productId, quantity) VALUES (?, ?)',
    [productId, quantity],
    (err, result) => {
      if (err) return res.status(500).send(err);

      //return to new cart item id on the frontend for reference
      res.json({ id: result.insertId });
    }
  );
};

// Update the quantity of an existing cart item
exports.updateQuantity = (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  db.query(
    'UPDATE cart_items SET quantity=? WHERE id=?',
    [quantity, id],
    (err) => {
      if (err) return res.status(500).send(err);
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
    if (err) return res.status(500).send(err);
    // Respond with 200 OK if deletion is successful
    res.sendStatus(200);
  });
};
