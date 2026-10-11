---
title: "Kiricheck"
year: 2025
deck: "Un reloj checador digital que funciona por WhatsApp, con los bonos, la prenómina y el monitoreo de incidencias que se construyen sobre la asistencia."
role: "Desarrollador backend"
stack: ["Python", "FastAPI", "AWS Lambda", "DynamoDB", "Playwright"]
status: live
featured: false
cover: ../images/kiricheck-architecture.es.svg
coverFit: contain
coverAlt: "Diagrama de arquitectura: los empleados registran asistencia por WhatsApp en un servicio Lambda que escribe en DynamoDB; los administradores usan un front en Nuxt que llama a una API de administración en FastAPI sobre Lambda, con módulos de bonos, prenómina, monitor de incidencias y reportes."
caption: "Del registro de asistencia al reporte de nómina: un almacén de tablas y una API de administración encima."
---

## El problema

Los negocios con personal por turnos necesitan saber quién checó, cuándo y qué significa eso para la nómina. Kiricheck permite a los empleados registrar entradas y salidas por WhatsApp, sin hardware en la puerta, y convierte esa asistencia en los números que necesita la nómina.

## Qué construí

- **El modelo de datos y los servicios:** esquemas en DynamoDB y servicios CRUD en Python sobre AWS Lambda.
- **Los módulos de bonos y prenómina,** que hacen sus cálculos sobre los datos de asistencia.
- **Un monitor de incidencias en tiempo real** construido con FastAPI.
- **Reportes de nómina:** exportaciones a Excel como la lista de raya con su columna de bonos, además de CSV y PDF.
- **Tests end-to-end** con Playwright para el front de administración.

Sigo manteniendo el sistema en producción.

## Decisiones

- **Serverless para una carga con picos predecibles.** Los registros se concentran en los cambios de turno; Lambda y DynamoDB absorben esos picos sin servidores ociosos el resto del día.
- **Modelar primero los patrones de acceso.** En DynamoDB el esquema sigue a las consultas —asistencia por empleado y por periodo— y no al revés.
- **Probar las pantallas de las que depende la nómina.** Un número equivocado en un reporte de nómina cuesta confianza, así que los flujos de administración están cubiertos de punta a punta.
