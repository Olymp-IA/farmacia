# Client Security Architecture

## Document Information

| Field | Value |
|-------|-------|
| Project | Enterprise Pharma Suite - Frontend |
| Version | 1.0.0 |
| Date | 2026-01-12 |
| Classification | Security Documentation |

## 1. Storage Strategy

### 1.1 Mobile Applications (pos-app, customer-app)

| Storage Type | Use Case | Security Level |
|--------------|----------|----------------|
| expo-secure-store | JWT tokens, user credentials | Hardware-backed encryption |
| AsyncStorage | Non-sensitive UI state | Not encrypted |
| In-memory (Zustand) | Session data, cart | Volatile |

### 1.2 Why SecureStore over AsyncStorage

AsyncStorage provides no encryption and stores data in plain text:
- Accessible via device rooting/jailbreak
- Exposed in device backups
- No protection against malware

SecureStore uses platform-native secure storage:
- iOS: Keychain Services (hardware-backed on devices with Secure Enclave)
- Android: Keystore System (hardware-backed on devices with TEE)

### 1.3 Implementation

```typescript
// src/hooks/useAuthStorage.ts
import * as SecureStore from 'expo-secure-store';

export const authStorage = {
  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
  },
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  },
  async deleteToken(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  },
};
```

### 1.4 Data Classification

| Data Type | Storage | Justification |
|-----------|---------|---------------|
| JWT Access Token | SecureStore | Authentication credential |
| Refresh Token | SecureStore | Long-lived credential |
| Tenant ID | SecureStore | Business-critical isolation |
| User profile (name) | AsyncStorage | Non-sensitive, UX convenience |
| Cart items | Zustand (memory) | Volatile, no persistence needed |

## 2. Biometric Authentication Flow

### 2.1 Use Cases

| Application | Screen | Biometric Requirement |
|-------------|--------|----------------------|
| pos-app | /(hr)/payrolls | Required - salary data protection |
| customer-app | Login | Optional - convenience feature |

### 2.2 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Opens Screen                        │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Check Biometric Availability                    │
│         LocalAuthentication.hasHardwareAsync()               │
│         LocalAuthentication.isEnrolledAsync()                │
└─────────────────────────────┬────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
      ┌───────────────┐              ┌───────────────┐
      │   Available   │              │ Not Available │
      └───────┬───────┘              └───────┬───────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│ Prompt for Biometric    │      │ Fall back to password   │
│ Face ID / Touch ID      │      │ or show content         │
└───────────┬─────────────┘      └─────────────────────────┘
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
┌──────────┐ ┌──────────┐
│ Success  │ │ Failure  │
└────┬─────┘ └────┬─────┘
     │            │
     ▼            ▼
┌──────────┐ ┌──────────────┐
│ Display  │ │ Show locked  │
│ Content  │ │ screen       │
└──────────┘ └──────────────┘
```

### 2.3 Implementation

```typescript
// src/hooks/useBiometricAuth.ts
const authenticate = async (promptMessage: string) => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    fallbackLabel: 'Use password',
    disableDeviceFallback: false,
  });
  return result.success;
};
```

## 3. Privacy Screen

### 3.1 Purpose

When the application moves to background state, sensitive data may be visible in:
- iOS App Switcher
- Android Recent Apps
- Screenshots taken by system

### 3.2 Implementation

```typescript
// src/components/PrivacyScreen.tsx
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextState) => {
    if (nextState.match(/inactive|background/)) {
      setIsHidden(true);  // Show privacy overlay
    } else if (nextState === 'active') {
      setIsHidden(false); // Remove overlay
    }
  });
  return () => subscription.remove();
}, []);
```

### 3.3 Protected Screens

| Application | Screen | Sensitivity |
|-------------|--------|-------------|
| pos-app | POS main (customer data) | Medium |
| pos-app | Payrolls (salary data) | High |
| customer-app | Prescription (health data) | High |

## 4. XSS Prevention (Web Store)

### 4.1 Content Security Policy

The web-store implements a strict CSP via next.config.js:

```javascript
headers: [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.farmacia.io",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]
```

### 4.2 CSP Directive Breakdown

| Directive | Value | Purpose |
|-----------|-------|---------|
| default-src | 'self' | Block all external resources by default |
| script-src | 'self' | Only allow scripts from same origin |
| connect-src | API domains | Whitelist backend connections |
| frame-ancestors | 'none' | Prevent clickjacking |

### 4.3 Token Storage Strategy (Web)

| Storage | Security | Recommendation |
|---------|----------|----------------|
| localStorage | XSS vulnerable | NEVER use for tokens |
| sessionStorage | XSS vulnerable | Avoid |
| HttpOnly Cookie | XSS protected | Preferred (requires backend) |
| In-memory (Zustand) | XSS protected | Acceptable fallback |

Current implementation uses Zustand (in-memory) as the backend does not yet support HttpOnly cookie authentication.

### 4.4 Input Sanitization

All user inputs (search queries, form fields) are:
1. Escaped before rendering in React (automatic)
2. Validated on backend before database insertion
3. Never inserted as raw HTML (no dangerouslySetInnerHTML)

## 5. Additional Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Prevents iframe embedding |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Limits referrer leakage |
| Permissions-Policy | camera=(), microphone=() | Restricts browser APIs |
| HSTS | max-age=31536000 | Forces HTTPS for 1 year |

## 6. Summary

| Control | Mobile Apps | Web Store |
|---------|-------------|-----------|
| Token Storage | SecureStore | In-memory |
| Biometric Auth | Implemented | N/A |
| Privacy Screen | Implemented | N/A |
| CSP | N/A | Strict policy |
| XSS Prevention | N/A | React escaping + CSP |
| HTTPS | Enforced | HSTS enabled |

---

> powered by **OLYMP-IA.cl** | [https://olymp-ia.cl](https://olymp-ia.cl) | [GitHub](https://github.com/Olymp-IA)
