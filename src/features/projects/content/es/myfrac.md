---
title: "MYFRAC"
year: 2024
deck: "Una plataforma para comunidades residenciales con control de acceso facial y por QR sobre IoT, apps móviles para residentes y vigilantes, y un asistente de WhatsApp que gestiona unos 7,000 accesos de visitantes al mes."
role: "Desarrollador full-stack y tech lead del squad"
stack: ["Python", "FastAPI", "Java", "Spring Boot", "AWS IoT Core", "DynamoDB", "Flutter"]
status: live
featured: true
order: 2
cover: ../images/myfrac-architecture.es.svg
coverFit: contain
coverAlt: "Diagrama de arquitectura: los dispositivos de acceso publican eventos por MQTT a AWS IoT Core, EventBridge los enruta a Lambda y DynamoDB; residentes, guardias y administradores usan una API en Spring Boot y un servicio FastAPI de invitaciones QR."
caption: "Cómo pasa una visita por la caseta: los dispositivos publican eventos y la nube los enruta."
highlights:
  - value: "11"
    label: "Comunidades residenciales"
  - value: "~5,000"
    label: "Usuarios activos"
  - value: "4–10 → 1–3 min"
    label: "Tiempo de atención por visita"
---

## El problema

Los fraccionamientos residenciales necesitan saber quién entra, quién lo invitó y cuándo. Antes de automatizarlo, guardias y residentes coordinaban cada visita a mano, y una sola visita podía tardar de 4 a 10 minutos en procesarse en la caseta.

MYFRAC opera en 11 comunidades residenciales de México y Honduras, con unos 5,000 usuarios activos: residentes, guardias y administradores.

## Qué construí

Llevo la mayor parte de la plataforma de punta a punta: la infraestructura, el backend en Java, las apps móviles de residentes y vigilantes, los paneles web de administración y los chatbots de WhatsApp para residentes.

- **El backend principal en Spring Boot,** apoyado en funciones AWS Lambda para el trabajo asíncrono, con reportes en CSV, Excel y PDF en Python y Java.
- **Control de acceso por MQTT.** Los dispositivos de las casetas —terminales de reconocimiento facial y escáneres de QR— se conectan a través de AWS IoT Core. Los eventos de acceso pasan por EventBridge a Lambda y se guardan en DynamoDB, y los rostros y códigos QR se gestionan en los dispositivos por el mismo canal.
- **El asistente de WhatsApp para residentes,** construido sobre Botmaker con comprensión de lenguaje basada en LLMs (OpenAI y Anthropic). Gestiona unos 7,000 accesos automatizados de visitantes al mes y bajó el tiempo de atención de 4–10 minutos a 1–3, medido con métricas operativas que implementé.
- **Las apps Flutter de vigilantes y residentes** para iOS y Android, y los paneles web con los que los administradores operan cada comunidad.
- **Invitaciones con QR, de punta a punta:** el flujo conversacional, un servicio nuevo en FastAPI, cambios en la API de Spring Boot para mantener compatibilidad, la app Flutter para escanear el QR en la caseta y el despliegue en AWS con CDK.
- **Seguridad para dispositivos y personas:** firmas HMAC para autenticar los dispositivos IoT contra la API, y el flujo propio de login y tokens OAuth2 de la plataforma con Spring Security.


## Decisiones

- **Eventos, no polling, para los accesos.** Los dispositivos publican una vez y la nube enruta el evento. EventBridge desacopla la caseta de lo que consuma el evento después.
- **Un servicio nuevo junto al núcleo, no dentro de él.** Las invitaciones con QR salieron como un servicio en FastAPI con cambios mínimos en la API de Spring Boot, así la feature avanzó rápido sin desestabilizar un backend del que dependen 11 comunidades.
- **Infraestructura como código desde el inicio.** El stack serverless (Lambda, API Gateway, DynamoDB, EventBridge, IoT Core, S3, Secrets Manager) se despliega con AWS CDK, así los entornos son reproducibles y revisables.
- **Medir lo que se afirma.** El tiempo ahorrado en la caseta se respalda con métricas construidas a partir de eventos del sistema, no con estimaciones.
