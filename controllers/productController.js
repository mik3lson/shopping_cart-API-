const db = require('../models/db');// MySQL connection instance

// Fetch all products from the database
exports.getAll = (req, res) => {
    // Simple SELECT returns the entire products table
  // No filters here — could be extended later for pagination or category filters
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send(err.message);
    // Directly return results array to client
    res.json(results);
  });
};
//// Add a new product to the catalog
exports.create = (req, res) => {
  const { sku, name, description, price, stockLevel, categoryId } = req.body;
  db.query(
    'INSERT INTO products (sku, name, description, price, stockLevel, categoryId) VALUES (?, ?, ?, ?, ?, ?)',
    [sku, name, description, price, stockLevel, categoryId],
    (err, result) => {
      if (err) return res.status(500).send(err.message);

      // Returning the new product's ID lets the frontend link or retrieve it immediately
      res.json({ id: result.insertId });
    }
  );
};

//Update the details of an existing product
exports.update = (req, res) => {
  const { id } = req.params;
  const { sku, name, description, price, stockLevel, categoryId } = req.body;
  db.query(
    'UPDATE products SET sku=?, name=?, description=?, price=?, stockLevel=?, categoryId=? WHERE id=?',
    [sku, name, description, price, stockLevel, categoryId, id],
    (err) => {
      if (err) return res.status(500).send(err.message);
      res.sendStatus(200);
    }
  );
};

//Delete a product from the database
exports.remove = (req, res) => {
  const { id } = req.params;

  // Deletes only the product with matching ID to avoid unintended mass deletions
  db.query('DELETE FROM products WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(200);
  });
};
