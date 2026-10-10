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
---

## El problema

Un club privado de golf y campo necesitaba un solo sistema para administrar sus áreas compartidas —canchas de tenis y pádel, spa, pilates— y a las muchas personas que las operan, cada una con un nivel de acceso distinto. El nombre del cliente es confidencial.

## Qué construí

- **El sistema de reservas** de áreas compartidas, con un front en React y un backend en Python/FastAPI sobre PostgreSQL.
- **Control de acceso basado en roles con permisos granulares:** superadmin, admin, supervisor y operador, además de roles de staff. La interfaz autoriza por capacidades, así cada pantalla y acción aparece solo para quien puede usarla.
- **La infraestructura en Terraform** sobre AWS, iterada con el equipo de infraestructura del cliente a partir de sus revisiones, y contenedores Docker como parte del flujo de despliegue.
- **Tests de la app web de reservas:** pruebas unitarias con Vitest y end-to-end con Playwright.

## Decisiones

- **Capacidades en lugar de chequeos de rol en la interfaz.** Los componentes preguntan "¿este usuario puede hacer X?" en vez de "¿este usuario es admin?". Un rol nuevo se resuelve con permisos, no con cambios de código.
- **Infraestructura revisada como código.** Escribir la infraestructura en Terraform permitió que el equipo de infra del cliente revisara cada cambio antes de que llegara a sus cuentas.
- **Tests end-to-end en el flujo de reserva,** porque una cancha reservada dos veces es el primer bug que notan los socios.
