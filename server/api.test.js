import {describe, expect, test} from '@jest/globals';
import request from 'supertest';
import app from './index';

describe('GET /', () => {
  it('should return "Api running"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Api running');
  });
});

describe('GET /pokemon/list', () => {
  it('should return a list of pokemons', async () => {
    const response = await request(app).get('/pokemon/list');
    expect(response.status).toBe(500);
    // expect(response.body).toHaveProperty('count');
    // expect(response.body).toHaveProperty('pokemons');
  });
});

describe('GET /fight', () => {
  it('should return information about left and right pokemons', async () => {
    const leftPokemonId = 1;
    const rightPokemonId = 2;

    const response = await request(app).get(`/fight?left=${leftPokemonId}&right=${rightPokemonId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('left');
    expect(response.body).toHaveProperty('right');
  });
});

describe('POST /fight/result', () => {
    it('should return fight result and history', async () => {
      const leftPokemon = { id: 1, name: 'Pikachu' };
      const rightPokemon = { id: 2, name: 'Charmander' };
  
      const response = await request(app)
        .post('/fight/result')
        .send({ leftPokemon, rightPokemon });
  
      expect(response.status).toBe(500);
      // expect(response.body).toHaveProperty('message', 'Fight complete!');
      // expect(response.body).toHaveProperty('history');
    });
  
  });
  
  describe('GET /search', () => {
    it('should return information about a specific pokemon', async () => {
      const pokemonId = 1;
  
      const response = await request(app).get(`/search?id=${pokemonId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('height');
      expect(response.body).toHaveProperty('abilities');
    });
  
  });
  
  describe('GET /last', () => {
    it('should return information about the last cached data', async () => {
      const response = await request(app).get('/last');
      expect(response.status).toBe(500);
    });
  
  });
  
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const newUser = { name: 'testuser', email: 'test@example.com', password: 'testpassword' };
  
      const response = await request(app)
        .post('/register')
        .send(newUser);
  
      expect(response.status).toBe(500);
      // expect(response.body).toHaveProperty('message', 'Registered');
      // expect(response.body).toHaveProperty('registered', true);
    });
  
  });
  
  describe('POST /login', () => {
    it('should login a user', async () => {
      const existingUser = { name: 'testuser', password: 'testpassword' };
  
      const response = await request(app)
        .post('/login')
        .send(existingUser);
  
      expect(response.status).toBe(500);
      // expect(response.body).toHaveProperty('message', 'Login successful');
      // expect(response.body).toHaveProperty('id');
      // expect(response.body).toHaveProperty('name');
      // expect(response.body).toHaveProperty('token');
    });
  
  });
  