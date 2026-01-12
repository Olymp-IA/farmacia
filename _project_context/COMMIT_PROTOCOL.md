# Commit Protocol - Farmacia SaaS

Protocolo de control de calidad para commits en el repositorio.

## 1. Regla de Actualizacion Obligatoria

Cada commit que modifique codigo fuente DEBE incluir actualizaciones a:

| Artefacto | Ubicacion | Condicion |
|-----------|-----------|-----------|
| SRS.md | technical_specs/SRS.md | Si cambian requisitos funcionales o no funcionales |
| SDD.md | technical_specs/SDD.md | Si cambia arquitectura, componentes o interfaces |
| Diagramas Mermaid | technical_specs/diagrams/*.mermaid | Si cambia flujo de datos o arquitectura del sistema |

### Excepciones

- Commits de correccion de typos
- Actualizaciones de dependencias menores (patch versions)
- Cambios exclusivos a archivos de configuracion local

## 2. Zero-Icons Policy

La documentacion tecnica debe cumplir con estilo profesional:

- PROHIBIDO: Uso de emojis, iconos unicode o caracteres decorativos
- PERMITIDO: Texto tecnico puro, tablas, listas y diagramas Mermaid
- RAZON: Maximizar legibilidad en entornos CLI, diffs de Git y herramientas de revision de codigo

### Ejemplos

```
INCORRECTO: ## Backend Core
CORRECTO:   ## Backend Core

INCORRECTO: - Implementar autenticacion
CORRECTO:   - Implementar autenticacion
```

## 3. Regla de README

El archivo README.md en la raiz del proyecto debe ser:

- INTERACTIVO: Tabla de Contenidos con enlaces internos
- EXHAUSTIVO: Cubrir instalacion, configuracion, uso y contribucion
- ACTUALIZADO: Sincronizado con cada release o cambio significativo

### Estructura Minima del README

```markdown
# Proyecto Farmacia SaaS

## Tabla de Contenidos
- [Arquitectura](#arquitectura)
- [Instalacion](#instalacion)
- [Configuracion](#configuracion)
- [Uso](#uso)
- [Contribucion](#contribucion)
- [Licencia](#licencia)
```

## 4. Flujo de Memoria

Antes de ejecutar `git commit`, el desarrollador debe:

1. Revisar `_project_context/roadmap.md`
2. Marcar tareas completadas con `[x]`
3. Actualizar tareas en progreso con `[/]`
4. Verificar coherencia entre cambios y roadmap

### Comando de Verificacion

```bash
# Antes de commit, revisar:
cat _project_context/roadmap.md
cat _project_context/pre_commit_checklist.txt
```

## 5. Formato de Mensaje de Commit

```
<tipo>(<alcance>): <descripcion>

[cuerpo opcional]

[pie opcional]
```

### Tipos Permitidos

| Tipo | Descripcion |
|------|-------------|
| feat | Nueva funcionalidad |
| fix | Correccion de bug |
| docs | Cambios en documentacion |
| refactor | Refactorizacion de codigo |
| test | Adicion o modificacion de tests |
| chore | Tareas de mantenimiento |

---

Fecha de vigencia: 2026-01-12
Version: 1.0.0

---

> powered by **OLYMP-IA.cl** | [https://olymp-ia.cl](https://olymp-ia.cl) | [GitHub](https://github.com/Olymp-IA)
