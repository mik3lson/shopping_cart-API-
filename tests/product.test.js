const request = require('supertest');
const express = require('express');
const productController = require('../controllers/productController');

// Mock the db module
jest.mock('../models/db', () => ({
  query: jest.fn(),
}));
const db = require('../models/db');

const app = express();
app.use(express.json());

// Setup routes for testing
app.get('/products', productController.getAll);
app.post('/products', productController.create);
app.put('/products/:id', productController.update);
app.delete('/products/:id', productController.remove);

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /products', () => {
    it('should return all products', async () => {
      const fakeProducts = [{ id: 1, name: 'Test Product' }];
      db.query.mockImplementation((sql, callback) => {
        callback(null, fakeProducts);
      });

      const res = await request(app).get('/products');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(fakeProducts);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM products', expect.any(Function));
    });

    it('should handle db errors', async () => {
      db.query.mockImplementation((sql, callback) => {
        callback(new Error('DB error'), null);
      });

      const res = await request(app).get('/products');

      expect(res.statusCode).toBe(500);
      expect(res.text).toContain('DB error');
    });
  });

  describe('POST /products', () => {
    it('should create a new product and return id', async () => {
      const newProduct = {
        sku: 'SKU123',
        name: 'New Product',
        description: 'Desc',
        price: 100,
        stockLevel: 10,
        categoryId: 1,
      };
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, { insertId: 42 });
      });

      const res = await request(app).post('/products').send(newProduct);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ id: 42 });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO products'),
        expect.arrayContaining([
          newProduct.sku,
          newProduct.name,
          newProduct.description,
          newProduct.price,
          newProduct.stockLevel,
          newProduct.categoryId,
        ]),
        expect.any(Function)
      );
    });

    it('should handle db errors on create', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(new Error('Insert error'));
      });

      const res = await request(app).post('/products').send({});

      expect(res.statusCode).toBe(500);
      expect(res.text).toContain('Insert error');
    });
  });

  describe('PUT /products/:id', () => {
    it('should update a product and respond with 200', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null);
      });

      const res = await request(app)
        .put('/products/5')
        .send({
          sku: 'SKU5',
          name: 'Updated Product',
          description: 'Updated Desc',
          price: 50,
          stockLevel: 5,
          categoryId: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE products SET'),
        expect.arrayContaining(['SKU5', 'Updated Product', 'Updated Desc', 50, 5, 2, '5']),
        expect.any(Function)
      );
    });

    it('should handle db errors on update', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(new Error('Update error'));
      });

      const res = await request(app).put('/products/5').send({});

      expect(res.statusCode).toBe(500);
      expect(res.text).toContain('Update error');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product and respond with 200', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null);
      });

      const res = await request(app).delete('/products/3');

      expect(res.statusCode).toBe(200);
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM products WHERE id=?',
        ['3'],
        expect.any(Function)
      );
    });

    it('should handle db errors on delete', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(new Error('Delete error'));
      });

      const res = await request(app).delete('/products/3');

      expect(res.statusCode).toBe(500);
      expect(res.text).toContain('Delete error');
    });
  });
});
