const request = require('supertest');
const express = require('express');
const cartController = require('../controllers/cartController');

jest.mock('../models/db', () => ({
  query: jest.fn(),
}));
const db = require('../models/db');

const app = express();
app.use(express.json());

// Define routes for testing
app.get('/cart', cartController.viewCart);
app.post('/cart', cartController.addItem);
app.put('/cart/:id', cartController.updateQuantity);
app.delete('/cart/:id', cartController.removeItem);

describe('Cart Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /cart', () => {
    it('should return cart items and total', async () => {
      const fakeCartItems = [
        { id: 1, name: 'Product A', price: 10, quantity: 2, subtotal: 20 },
        { id: 2, name: 'Product B', price: 5, quantity: 3, subtotal: 15 },
      ];
      db.query.mockImplementation((sql, callback) => {
        callback(null, fakeCartItems);
      });

      const res = await request(app).get('/cart');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        items: fakeCartItems,
        total: 35, // 20 + 15
      });
      expect(db.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    });

    it('should handle db errors on viewCart', async () => {
      db.query.mockImplementation((sql, callback) => {
        callback(new Error('DB error'));
      });

      const res = await request(app).get('/cart');

      expect(res.statusCode).toBe(500);
      expect(res.text).toContain('DB error');
    });
  });

  describe('POST /cart', () => {
    it('should add a new item and return id', async () => {
      const newItem = { productId: 3, quantity: 4 };
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, { insertId: 99 });
      });

      const res = await request(app).post('/cart').send(newItem);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ id: 99 });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO cart_items'),
        [newItem.productId, newItem.quantity],
        expect.any(Function)
      );
    });

    it('should handle db errors on addItem', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(new Error('Insert error'));
      });

      const res = await request(app).post('/cart').send({});

      expect(res.statusCode).toBe(500);
      expect(res.text).toContain('Insert error');
    });
  });

  describe('PUT /cart/:id', () => {
    it('should update quantity and respond with 200', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null);
      });

      const res = await request(app)
        .put('/cart/5')
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(200);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE cart_items SET quantity=? WHERE id=?'),
        [10, '5'],
        expect.any(Function)
      );
    });

    it('should handle db errors on updateQuantity', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(new Error('Update error'));
      });

      const res = await request(app).put('/cart/5').send({ quantity: 1 });

      expect(res.statusCode).toBe(500);
      expect(res.text).toContain('Update error');
    });
  });

  describe('DELETE /cart/:id', () => {
    it('should delete an item and respond with 200', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null);
      });

      const res = await request(app).delete('/cart/3');

      expect(res.statusCode).toBe(200);
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM cart_items WHERE id=?',
        ['3'],
        expect.any(Function)
      );
    });

    it('should handle db errors on removeItem', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(new Error('Delete error'));
      });

      const res = await request(app).delete('/cart/3');

      expect(res.statusCode).toBe(500);
      expect(res.text).toContain('Delete error');
    });
  });
});
