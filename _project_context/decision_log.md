# Decision Log - Farmacia SaaS

Registro cronológico de decisiones de arquitectura del proyecto.

## Formato de Entrada

```
### [YYYY-MM-DD] Título de la Decisión

**Contexto:** Descripción del problema o necesidad.

**Decisión:** Descripción de la decisión tomada.

**Alternativas consideradas:**
- Alternativa A
- Alternativa B

**Consecuencias:**
- Positivas: ...
- Negativas: ...

**Estado:** [Propuesta | Aceptada | Deprecada | Reemplazada]
```

---

## Decisiones

### [2026-01-12] Arquitectura Híbrida del Monorepo

**Contexto:** Definición de la arquitectura tecnológica inicial del sistema SaaS para farmacias.

**Decisión:** Adoptar arquitectura de monorepo con:
- Backend Core: Java 17 + Spring Boot 3.2
- AI Service: Python + FastAPI
- POS App: React Native
- Web Store: Next.js 14

**Alternativas consideradas:**
- Monolito Java único
- Microservicios separados en repositorios independientes

**Consecuencias:**
- Positivas: Desarrollo coordinado, versionado unificado, reutilización de código
- Negativas: Mayor complejidad de CI/CD

**Estado:** Aceptada

---

> powered by **OLYMP-IA.cl** | [https://olymp-ia.cl](https://olymp-ia.cl) | [GitHub](https://github.com/Olymp-IA)
