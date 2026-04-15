const request = require('supertest');
const app = require('../server'); 
const { initDb, getDb } = require('../db/connection'); 

// Ensures environment variables are loaded
require('dotenv').config();

describe('Calculations API Endpoints', () => {
  // Real IDs provided for testing
  const validUserId = '69d5a639d8980a13ed513adc';
  const validRecipeId = '69d2f42bf5a3e4ec6878eeec';

  beforeAll(async () => {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined in the .env file.");
      return;
    }

    try {
      await initDb();
      console.log("Database connected successfully for testing.");
    } catch (error) {
      console.error("Failed to connect to MongoDB in test setup:", error);
    }
  });

  describe('GET /calculations/users/:id/calories', () => {
    it('should return 200 and the calculated calories for a valid user', async () => {
      const response = await request(app)
        .get(`/calculations/users/${validUserId}/calories`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('User id', validUserId);
      expect(response.body).toHaveProperty('Basal metabolic rate');
      expect(response.body).toHaveProperty('Total daily energy expenditure');
      expect(response.body).toHaveProperty('Daily calories needed');
    });

    it('should return 400 for an invalid ObjectId format', async () => {
      await request(app)
        .get('/calculations/users/invalid-id/calories')
        .expect(400);
    });

    it('should return 404 if the user does not exist', async () => {
      const nonExistentId = '65f0a1b2c3d4e5f67890abcd'; 
      await request(app)
        .get(`/calculations/users/${nonExistentId}/calories`)
        .expect(404);
    });
  });

  describe('GET /calculations/recipes/:id/calculate', () => {
    it('should return 200 and recipe nutrition/cost details', async () => {
      const response = await request(app)
        .get(`/calculations/recipes/${validRecipeId}/calculate`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('Recipe title');
      expect(response.body).toHaveProperty('Total calories');
      expect(response.body).toHaveProperty('Total cost');
      expect(response.body).toHaveProperty('Calories per portion');
      expect(response.body).toHaveProperty('Cost per portion');
    });

    it('should return 404 for a non-existent recipe', async () => {
      const nonExistentRecipeId = '65f0a1b2c3d4e5f67890abce'; 
      await request(app)
        .get(`/calculations/recipes/${nonExistentRecipeId}/calculate`)
        .expect(404);
    });
  });

  describe('GET /calculations/recipes/recommended/:userId', () => {
    it('should return 200 and a list of recommended recipes', async () => {
      const response = await request(app)
        .get(`/calculations/recipes/recommended/${validUserId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // If there are recommended recipes, verify their structure
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('Target calories per meal');
        expect(response.body[0]).toHaveProperty('Calories per portion');
      }
    });

    it('should filter recommendations by meal type when query param is provided', async () => {
      const mealType = 'lunch';
      const response = await request(app)
        .get(`/calculations/recipes/recommended/${validUserId}?type=${mealType}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // Ensure all returned recipes match the requested type
      response.body.forEach(recipe => {
        expect(recipe.type).toBe(mealType);
      });
    });
  });
});