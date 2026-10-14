
import { request } from '@playwright/test';
import { test, expect } from '../../src/fixtures/api.fixture';

test.describe('Módulo de Autenticación - API', () => {
  test('@smoke Debería retornar un token válido al autenticarse con credenciales correctas', async ({ authApi }) => {
    const response = await authApi.login({
      email: 'tester01@yopmail.com',
      password: '12345678',
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('access_token');
    expect(responseBody.access_token).toEqual(
      expect.any(String)
    );
    expect(responseBody.access_token.length).toBeGreaterThan(0);
  });

  test('Deberia rechazar credenciales incorrectas', async ({ authApi }) => {
    const response = await authApi.login({
      email: 'tester01@yopmail.com',
      password: 'password-incorrecta',
    });

    expect(response.status()).toBe(401);

    const responseBody = await response.json();

    expect(responseBody.detail).toBe('Invalid credentials');
  })

  

test('Debería rechazar el login cuando la contraseña está vacía', async ({ authApi }) => {
  const response = await authApi.login({
    email: 'tester01@yopmail.com',
    password: '',
  });

  expect(response.status()).toBe(401);

  const responseBody = await response.json();

  expect(responseBody.detail).toBe('Invalid credentials');
});


test('Debería rechazar el login cuando falta la contraseña', async ({ request }) => {
  const response = await request.post('/v1/auth/login', {
    data: {
      email: 'tester01@yopmail.com',
    },
  });

  expect(response.status()).toBe(422);

  const responseBody = await response.json();

  expect(responseBody.detail).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: 'missing',
        loc: ['body', 'password'],
        msg: 'Field required',
      }),
    ])
  );
});

test('Debería rechazar el login cuando falta el email', async ({ request }) => {
  const response = await request.post('/v1/auth/login', {
    data: {
      password: '12345678',
    },
  });

  expect(response.status()).toBe(422);

  const responseBody = await response.json();

  expect(responseBody.detail).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: 'missing',
        loc: ['body', 'email'],
        msg: 'Field required',
      }),
    ])
  );
});


test('Debería rechazar el login cuando el correo tiene un formato inválido', async ({ request }) => {
  const response = await request.post('/v1/auth/login', {
    data: {
      email: 'correo-invalido',
      password: '12345678',
    },
  });

  expect(response.status()).toBe(401);

  const responseBody = await response.json();

  expect(responseBody.detail).toBe('Invalid credentials');
});




test('Debería rechazar el login cuando el cuerpo de la petición está vacío', async ({ request }) => {
  const response = await request.post('/v1/auth/login', {
    data: {},
  });

  expect(response.status()).toBe(422);

  const responseBody = await response.json();

  expect(responseBody.detail).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: 'missing',
        loc: ['body', 'email'],
        msg: 'Field required',
      }),
      expect.objectContaining({
        type: 'missing',
        loc: ['body', 'password'],
        msg: 'Field required',
      }),
    ])
  );
});


test('Debería rechazar el login cuando el cuerpo no es un objeto JSON', async ({ request }) => {
  const response = await request.post('/v1/auth/login', {
    data: 'texto-invalido',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  expect(response.status()).toBe(422);

  const responseBody = await response.json();

  expect(responseBody.detail).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: 'model_attributes_type',
        loc: ['body'],
        msg: 'Input should be a valid dictionary or object to extract fields from',
        input:'texto-invalido'
      }),
    ])
  );
});



test('Debería rechazar el login cuando el email es un número', async ({ request }) => {
  const response = await request.post('/v1/auth/login', {
    data: {
      email: 12345,
      password: '12345678',
    },
  });

  expect(response.status()).toBe(422);

  const responseBody = await response.json();

  expect(responseBody.detail).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: 'string_type',
        loc: ['body', 'email'],
        msg: 'Input should be a valid string',
        input: 12345,
      }),
    ])
  );
});

});