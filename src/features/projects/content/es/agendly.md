---
title: "Agendly"
year: 2026
deck: "Agendamiento de citas para pequeños negocios de belleza en México, para que los dueños dejen de llevar su día por chats de WhatsApp."
role: "Fundador y único desarrollador"
stack: ["NestJS", "Nuxt 3", "PostgreSQL", "Prisma", "TypeScript"]
status: in-progress
featured: true
order: 4
cover: ../images/agendly-booking.webp
coverFit: contain
coverAlt: "Flujo de reserva en un teléfono para una barbería ficticia: lista de servicios con precios, elección de especialista y una cuadrícula de día y horario con un horario seleccionado."
caption: "El flujo de reserva, de enlace a horario en tres toques: sin cuenta y sin app."
figures:
  - src: ../images/agendly-admin.webp
    alt: "Agenda del administrador con un día de ocho citas, con cliente, servicio, horario y estado, y alertas de riesgo de inasistencia en dos citas próximas que explican por qué podrían faltar."
    caption: "La agenda del día, con el riesgo de inasistencia señalado y explicado."
    kind: screen
  - src: ../images/agendly-insights.webp
    alt: "Panel de métricas de impacto: citas, porcentaje reservado por el propio cliente, inasistencias, tiempo mediano de reserva, clientes que regresan, citas por semana, resultados de los recordatorios y precisión del modelo de predicción de inasistencias."
    caption: "Lo que la herramienta hace por el dueño: reservas, inasistencias, recordatorios y la precisión del modelo de riesgo."
    kind: screen
---

## El problema

Los salones, barberías y spas en México agendan citas a mano por WhatsApp. El dueño cambia de contexto todo el día, las reservas se pierden o se registran mal y las inasistencias llegan sin aviso. Las herramientas globales como Calendly o Acuity no encajan: están en inglés, piden al cliente final crear una cuenta y tienen precios pensados para otro mercado.

## Qué construí

Un SaaS multi-tenant con dos caras:

- **Una página pública de reservas** con una URL compartible por negocio. El cliente elige servicio, empleado y horario disponible, deja su nombre y teléfono (el email es opcional y trae una confirmación) y listo. Sin crear cuenta.
- **Un panel de administración mobile-first** con vistas de agenda por día, semana y mes, citas manuales para clientes sin reserva y cambios de estado (completada, no asistió, cancelada). Al cancelar, el cliente recibe un email, si dejó su correo, con un enlace para agendar otro horario.
- **Alerta temprana de inasistencias.** Las citas próximas reciben una puntuación de riesgo de inasistencia y se marcan en la agenda con los motivos a la vista (por ejemplo, el cliente faltó a citas anteriores o es nuevo). El día antes de la cita, Agendly envía un recordatorio por email; en las citas de riesgo alto el correo pide con más claridad confirmar o llamar para liberar el horario.
- **Una pantalla de impacto** que le muestra al dueño qué está haciendo la herramienta: cuántas reservas llegan solas por el enlace, la tasa de inasistencias, cuánto tardan los clientes en reservar, clientes que regresan, volumen semanal y cómo se desempeñan los recordatorios y el modelo de riesgo frente a los resultados del propio negocio.

Es un monorepo pnpm con tres paquetes: un backend en NestJS (Prisma, PostgreSQL, Passport con JWT y Google OAuth), un frontend en Nuxt 3 (Vue 3, Tailwind CSS, Pinia) y un paquete compartido de DTOs y tipos TypeScript que usan ambos. El email sale por Resend y la integración continua corre en GitHub Actions. El frontend se despliega en Netlify y la API en Render, sobre un PostgreSQL gestionado en Neon, con logo y banner optimizados a WebP en Cloudflare R2. Sentry, logs estructurados en JSON con ID de petición y health checks cubren la observabilidad.

Alrededor del núcleo están las bases de la cuenta: registro con email o Google, restablecimiento de contraseña con un enlace de un solo uso que caduca en 30 minutos, y páginas de Términos, Aviso de Privacidad y ARCO, con la aceptación de términos guardada por usuario.

## Decisiones

- **Aislamiento por tenant en el modelo de datos.** Cada tabla lleva un `tenantId`, así que cada negocio es un tenant aislado desde la primera migración, con su propia zona horaria para la disponibilidad, la validación de reservas y todas las horas mostradas.
- **Un motor de reservas agnóstico al canal.** El motor no sabe si la cita llegó por el formulario web, por captura manual o, más adelante, por WhatsApp. Los canales nuevos se conectan sin tocar las reglas de agenda.
- **Borrado lógico para empleados y servicios,** para que las citas pasadas conserven su historial cuando cambia el catálogo.
- **Un modelo de inasistencias interpretable, no una caja negra.** La puntuación es una fórmula logística sobre pocas señales visibles: las inasistencias y visitas completadas previas del cliente, si es nuevo, con cuánta anticipación reservó, el canal de la reserva y si dejó su email. Los pesos son valores previos informados y no entrenados, porque un negocio pequeño tiene muy poco historial para ajustar un modelo sin sobreajustar, y el dueño necesita ver por qué se marca una cita. La pantalla de métricas pone a prueba la puntuación con citas pasadas, usando solo el historial que existía antes de cada una, de modo que los pesos puedan reajustarse cuando haya suficientes datos. Es solo una ayuda: nunca bloquea ni rechaza una reserva.
- **Recordatorios desde un planificador externo.** El host gratuito de la API se duerme al quedar inactivo, así que un cron dentro del proceso no se dispararía. Un job de GitHub Actions llama cada hora a un endpoint protegido con un secreto, y cada cita se reclama de forma atómica antes de enviar, para que dos ejecuciones simultáneas nunca escriban dos veces al mismo cliente.
- **Doble reserva bloqueada en la base de datos.** Una restricción de exclusión de PostgreSQL rechaza citas confirmadas que se traslapen para el mismo empleado, así que la garantía se mantiene aunque lleguen dos solicitudes a la vez.
- **Sesiones por cookie con refresh tokens rotativos.** El token de sesión vive en una cookie httpOnly que los scripts no pueden leer, de vida corta y renovada con un refresh token que rota en cada uso; reutilizar uno viejo revoca toda la cadena.
- **Cobro construido, pero apagado.** Existen las suscripciones de Stripe, una prueba de 14 días y el bloqueo de acceso, pero una sola bandera del servidor las mantiene apagadas mientras Agendly es gratis; la página pasa a ser un enlace de apoyo voluntario. La bandera sigue apagada hasta definir términos de pago y facturación.
