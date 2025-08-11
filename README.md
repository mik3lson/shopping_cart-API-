# Shopping Cart API

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/shopping-cart.git
   cd shopping-cart
2. **Install dependecies**
   ```bash
   npm install

3. **Setup your MySQL database**
   Make sure MySQL is installed and running on your machine
   Login to MySQL
   ```bash
   mysql -u root -p

4. **Create the database**
   create the datbase table with the sql code from schema.sql
   
5. **Configure environment variables**
   create a .env file and add your database credentials
   ```js
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=shopping_cart
6. **Start the server**
   ```bash
   npm start
7. **Run the test**
   ```bash
   npm test

## API Workflow Overview
**Products**


GET /products — Retrieve all products.

POST /products — Add a new product.

PUT /products/:id — Update product details.

DELETE /products/:id — Remove a product.

**Cart**


GET /cart — View all cart items with product details and total price.

POST /cart — Add an item to the cart.

PUT /cart/:id — Update quantity of a cart item.

DELETE /cart/:id — Remove an item from the cart.

## Design decisions
1. **Modular Controllers:** Separating the application logic into controllers (productController.js, cartController.js) helps keep the code organized and maintainable. Each controller handles a specific resource, making it easier to scale the project and onboard new developers.
2. **Database Access:** Instead of using an ORM (Object-Relational Mapping) library, raw SQL queries were chosen to maintain full control over database interactions, improve performance, and reduce abstraction layers. This approach allows precise optimization of queries, especially important when joining tables (e.g., cart items and products) and calculating subtotals directly in SQL.
3. **Error Handling: Basic error handling returns HTTP 500 status with error messages to facilitate debugging.**
4. **Testing: Used Jest and Supertest with mocked database calls to isolate API logic without hitting a real database.**

## Assumptions & Tradeoffs
**Assumptions:**
1. **Product IDs and Cart Item IDs are unique and valid.**
2. **Incoming requests contain all required fields in correct formats.**

**Tradeoffs:**
1. **Used raw SQL instead of an ORM for more control but less abstraction and safety.**
2. **Minimal validation logic; can be enhanced with middleware like Joi or express-validator.**
3. **Error messages sent directly, which might leak info in production (should be improved for security).**




   
