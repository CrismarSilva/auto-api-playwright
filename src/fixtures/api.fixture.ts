import { test as base, expect, request } from '@playwright/test';
import { AuthClient } from '../api/auth-client';
type ApiFixtures = {
    authApi: AuthClient;
};

export const test = base.extend<ApiFixtures>({
    authApi: async ({ request }, use) => {
        const authClient = new AuthClient(request);

        await use(authClient);
    },
});

export { expect };