import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';
const AI_BASE_URL = process.env.EXPO_PUBLIC_AI_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Request interceptor: inject JWT and Tenant-ID
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('auth_token');
            const tenantId = await SecureStore.getItemAsync('tenant_id');

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            if (tenantId) {
                config.headers['X-Tenant-ID'] = tenantId;
            }
        } catch (error) {
            console.error('Error reading secure store:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync('auth_token');
            // Navigation to login would happen here
        }
        return Promise.reject(error);
    }
);

// AI Service client
const aiClient = axios.create({
    baseURL: AI_BASE_URL,
    timeout: 10000,
});

aiClient.interceptors.request.use(async (config) => {
    const tenantId = await SecureStore.getItemAsync('tenant_id');
    if (tenantId && config.data) {
        config.data.tenant_id = tenantId;
    }
    return config;
});

export { apiClient, aiClient };
