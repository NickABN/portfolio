---
title: "Sistema de Clubes"
year: 2026
deck: "Una plataforma de gestión para un club privado de golf y campo: reservas de áreas compartidas, roles granulares para el personal e infraestructura como código. Cliente confidencial."
role: "Desarrollador full-stack"
stack: ["React", "Python", "FastAPI", "PostgreSQL", "Terraform", "Docker", "AWS"]
status: in-progress
featured: true
order: 3
client: true
cover: ../images/club-system-architecture.es.svg
coverFit: contain
coverAlt: "Diagrama de arquitectura: el personal y los operadores usan una app React en S3 y CloudFront que llama a un backend FastAPI sobre PostgreSQL en RDS, con un contrato OpenAPI, migraciones Goose, Terraform y un ETL en Python desde la base heredada alrededor."
caption: "Un contrato, un esquema: la app web, la API y la migración de datos cuelgan de ellos."
---

## El problema

Un club privado de golf y campo necesitaba un solo sistema para administrar sus áreas compartidas —canchas de tenis y pádel, spa, pilates— y a las muchas personas que las operan, cada una con un nivel de acceso distinto. El nombre del cliente es confidencial.

## Qué construí

- **El sistema de reservas** de áreas compartidas, con un front en React y un backend en Python/FastAPI sobre PostgreSQL.
- **Control de acceso basado en roles con permisos granulares:** superadmin, admin, supervisor y operador, además de roles de staff. La interfaz autoriza por capacidades, así cada pantalla y acción aparece solo para quien puede usarla.
- **La infraestructura en Terraform** sobre AWS, iterada con el equipo de infraestructura del cliente a partir de sus revisiones, y contenedores Docker como parte del flujo de despliegue.
- **La migración de datos desde la base heredada del club.** Un ETL en Python que lee el sistema anterior sin escribir jamás en él, guarda cada fila intacta en staging, la mapea al esquema nuevo y verifica el resultado antes de darlo por bueno.
- **Tests de la app web de reservas:** pruebas unitarias con Vitest y end-to-end con Playwright.

![Flujo de migración: se lee la base heredada, se carga en staging crudo, se transforma y mapea en una corrida de prueba y luego se escribe en el esquema nuevo de PostgreSQL, con validación, corridas idempotentes y un registro de corridas con rollback.](../images/club-system-etl.es.svg)

## Decisiones

- **Capacidades en lugar de chequeos de rol en la interfaz.** Los componentes preguntan "¿este usuario puede hacer X?" en vez de "¿este usuario es admin?". Un rol nuevo se resuelve con permisos, no con cambios de código.
- **Infraestructura revisada como código.** Escribir la infraestructura en Terraform permitió que el equipo de infra del cliente revisara cada cambio antes de que llegara a sus cuentas.
- **Migrar por etapas que se pueden repetir y deshacer.** El ETL guarda las filas heredadas crudas con un hash por fila, así que una nueva corrida omite lo que no cambió. El mapeo corre en modo de prueba por defecto, los conteos se validan contra el origen y cada escritura lleva un ID de corrida, de modo que una carga se puede revertir sin tocar el resto.
- **Tests end-to-end en el flujo de reserva,** porque una cancha reservada dos veces es el primer bug que notan los socios.
