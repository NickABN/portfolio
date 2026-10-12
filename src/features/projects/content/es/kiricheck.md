---
title: "Kiricheck"
year: 2025
deck: "Un reloj checador digital que funciona por WhatsApp, con los bonos, la prenómina y el monitoreo de incidencias que se construyen sobre la asistencia."
role: "Desarrollador backend"
stack: ["Python", "FastAPI", "AWS Lambda", "DynamoDB", "Playwright"]
status: live
featured: false
cover: ../images/kiricheck-card.es.svg
coverFit: contain
coverAlt: "Los empleados registran asistencia por WhatsApp en un servicio Lambda que escribe en DynamoDB. Una API de administración en FastAPI sobre Lambda lo lee y alimenta bonos, prenómina y reportes en Excel, CSV y PDF."
caption: "Un registro por WhatsApp termina como un número en el reporte de nómina."
figures:
  - src: ../images/kiricheck-architecture.es.svg
    alt: "Diagrama de arquitectura: los empleados registran asistencia por WhatsApp en un servicio Lambda que escribe en DynamoDB; los administradores usan un front en Nuxt que llama a una API de administración en FastAPI sobre Lambda, con módulos de bonos, prenómina, monitor de incidencias y reportes."
    caption: "Del registro de asistencia al reporte de nómina: un almacén de tablas y una API de administración encima."
    kind: diagram
  - src: ../images/kiricheck-monitor.webp
    alt: "Panel de administración, monitor de inasistencia: tabla de empleados del día con lugar de trabajo, horario esperado y estado detectado (sin entrada, retardo de varios minutos, salida anticipada), con una columna de gestión para justificar cada incidencia. Todos los datos mostrados son ficticios."
    caption: "El monitor de incidencias: quién llegó tarde, faltó o salió antes hoy, listo para justificar."
    kind: screen
  - src: ../images/kiricheck-bonuses.webp
    alt: "Panel de administración, asignación de bonos: tabla de bonos asignados a empleados en el periodo de pago, como puntualidad, asistencia perfecta y productividad de línea, en monto fijo, porcentaje o días. Todos los datos mostrados son ficticios."
    caption: "Bonos asignados por periodo de pago, la entrada sobre la que se construye el cálculo de prenómina."
    kind: screen
  - src: ../images/kiricheck-reports.webp
    alt: "Panel de administración, reportes: gráficas de horas trabajadas y horas extra del periodo, distribución de personal por lugar de trabajo y por rol, y una tabla detallada con primera entrada, última salida y horas por empleado, con menú de descarga. Todos los datos mostrados son ficticios."
    caption: "La asistencia convertida en números de nómina: el periodo de un vistazo y el detalle de las horas de cada empleado."
    kind: screen
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
