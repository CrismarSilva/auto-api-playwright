import { APIRequestContext } from '@playwright/test';

export class AuthClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(credentials: { email: string; password: string }) {
    // Apuntamos al endpoint exacto que confirmamos en tu documentación
    const response = await this.request.post('/v1/auth/login', {
      data: credentials,
    });

    return response;
  }
}