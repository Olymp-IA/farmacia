import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TENANT_KEY = 'tenant_id';
const USER_KEY = 'user_data';

export interface UserData {
    id: string;
    email: string;
    fullName: string;
    role: string;
}

export const authStorage = {
    async saveToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    },

    async getToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    },

    async deleteToken(): Promise<void> {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    },

    async saveRefreshToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    },

    async getRefreshToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    },

    async saveTenantId(tenantId: string): Promise<void> {
        await SecureStore.setItemAsync(TENANT_KEY, tenantId);
    },

    async getTenantId(): Promise<string | null> {
        return await SecureStore.getItemAsync(TENANT_KEY);
    },

    async saveUser(user: UserData): Promise<void> {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    },

    async getUser(): Promise<UserData | null> {
        const data = await SecureStore.getItemAsync(USER_KEY);
        return data ? JSON.parse(data) : null;
    },

    async clearAll(): Promise<void> {
        await Promise.all([
            SecureStore.deleteItemAsync(TOKEN_KEY),
            SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
            SecureStore.deleteItemAsync(TENANT_KEY),
            SecureStore.deleteItemAsync(USER_KEY),
        ]);
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return !!token;
    },
};

export function useAuthStorage() {
    return authStorage;
}
