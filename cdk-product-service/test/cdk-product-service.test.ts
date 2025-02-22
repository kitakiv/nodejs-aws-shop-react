import { handler as getProductsList } from '../lambda/products';
import { handler as getProductById } from '../lambda/productsById';
import { products } from '../lambda/productsData';

describe('Products API Tests', () => {
  describe('GET /products', () => {
    test('should return all products', async () => {
      const event = {
        httpMethod: 'GET',
        path: '/products'
      };

      const response = await getProductsList();

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      const data = body.data;
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('title');
      expect(data[0]).toHaveProperty('price');
      expect(data[0]).toHaveProperty('description');
      expect(data.length).toBe(products.length);
    });
  });

  describe('GET /products/{id}', () => {
    test('should return product by id', async () => {
        const firstProduct = products[0];
      const event = {
        httpMethod: 'GET',
        path: `products/${firstProduct.id}`,
        pathParameters: {
          id: firstProduct.id
        }
      };

      const response = await getProductById(event);

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      const data = body.data;
      expect(data).toHaveProperty('id', firstProduct.id);
      expect(data).toHaveProperty('description', firstProduct.description);
      expect(data).toHaveProperty('title', firstProduct.title);
      expect(data).toHaveProperty('price', firstProduct.price);
    });
    test('should return 404 for non-existent product', async () => {
      const event = {
        httpMethod: 'GET',
        path: '/products/999',
        pathParameters: {
          id: '999'
        }
      };

      const response = await getProductById(event);

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('message', 'Product with id: 999 not found');
    });
  });
});
