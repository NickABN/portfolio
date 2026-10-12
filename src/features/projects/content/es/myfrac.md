---
title: "MYFRAC"
year: 2024
deck: "Una plataforma para comunidades residenciales con control de acceso facial y por QR sobre IoT, apps móviles para residentes y vigilantes, y un asistente de WhatsApp que gestiona unos 7,000 accesos de visitantes al mes."
role: "Desarrollador full-stack y tech lead del squad"
stack: ["Python", "FastAPI", "Java", "Spring Boot", "AWS IoT Core", "MySQL", "Flutter"]
status: live
featured: true
order: 2
cover: ../images/myfrac-card.es.svg
coverFit: contain
coverAlt: "Los dispositivos de la caseta (terminales faciales y escáneres QR) llaman a una API Spring Boot por HTTPS firmado con HMAC, y la API guarda residentes y bitácora de visitas en MySQL. Un chatbot de WhatsApp envía QR temporales a los escáneres por AWS IoT Core sobre MQTT, unos 7,000 accesos al mes."
caption: "La plataforma en una vista: la caseta, la API central y el camino de los QR por WhatsApp."
figures:
  - src: ../images/myfrac-architecture.es.svg
    alt: "Diagrama de arquitectura: los dispositivos de la caseta llaman a una API en Spring Boot por HTTPS firmado con HMAC; la API guarda datos en MySQL y fotos en S3, las apps y paneles web se apoyan en ella, y un chatbot de WhatsApp y un servicio MQTT en Lambda envían QR temporales a través de AWS IoT Core."
    caption: "Cómo encaja la plataforma: la caseta habla con una sola API y los QR viajan por MQTT."
    kind: diagram
  - src: ../images/myfrac-facial-access.es.svg
    alt: "Diagrama: los administradores cargan fotos de residentes a la API Spring Boot, las terminales de la caseta descargan la lista activa por HTTPS y reportan cada entrada a una bitácora de visitas en MySQL, y los QR temporales de visitantes llegan a los escáneres por MQTT."
    caption: "Cómo pasa una visita por la caseta: las terminales descargan la lista activa, comparan rostros en el dispositivo y reportan cada entrada a la API."
    kind: diagram
  - src: ../images/myfrac-facial-ingest.webp
    alt: "Panel de administración, revisión de la carga masiva de fotos: cada foto del ZIP se asigna a un residente, con estados pendiente, rechazada y lista para activar antes de entrar en producción. Todos los datos mostrados son ficticios."
    caption: "Carga masiva de fotos, revisada antes de entrar en producción: cada foto del ZIP se asigna a un residente."
    kind: screen
  - src: ../images/myfrac-facial-visits.webp
    alt: "Panel de administración, bitácora de accesos faciales: tabla filtrable de entradas y salidas con el residente, la puerta y la hora de cada evento, alimentada por las terminales de la caseta. Todos los datos mostrados son ficticios."
    caption: "La bitácora de visitas que los administradores filtran y exportan: quién entró o salió, por qué puerta y cuándo."
    kind: screen
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
- **Control de acceso en la caseta.** Los dispositivos de las casetas —terminales de reconocimiento facial y escáneres de QR— se autentican contra la API con peticiones HTTPS firmadas con HMAC, y cada entrada y salida queda en una bitácora de visitas en MySQL. Los códigos QR temporales de visitantes llegan a los escáneres por MQTT a través de AWS IoT Core.
- **El asistente de WhatsApp para residentes,** construido sobre Botmaker con comprensión de lenguaje basada en LLMs (OpenAI y Anthropic). Gestiona unos 7,000 accesos automatizados de visitantes al mes y bajó el tiempo de atención de 4–10 minutos a 1–3, medido con métricas operativas que implementé.
- **Las apps Flutter de vigilantes y residentes** para iOS y Android, y los paneles web con los que los administradores operan cada comunidad.
- **Invitaciones con QR, de punta a punta:** el flujo conversacional, un servicio nuevo en FastAPI, cambios en la API de Spring Boot para mantener compatibilidad, la app Flutter para escanear el QR en la caseta y el despliegue en AWS con CDK.
- **Seguridad para dispositivos y personas:** firmas HMAC para autenticar los dispositivos IoT contra la API, y el flujo propio de login y tokens OAuth2 de la plataforma con Spring Security.

**El acceso facial, de punta a punta.** Los administradores cargan las fotos de los residentes, una por una o en un ZIP, y la API conserva hasta dos fotos activas por residente. Cada terminal de la caseta descarga la lista activa por HTTPS, reconoce los rostros en el propio equipo y reporta cada entrada y salida a la API con una petición firmada con HMAC, que queda en una bitácora de visitas que los administradores pueden filtrar y exportar. Los códigos QR de visitantes viajan en sentido contrario, como mensajes MQTT a través de AWS IoT Core.

## Decisiones

- **Reconocer en la caseta, registrar en la nube.** Las terminales comparan los rostros en local contra la lista que descargan de la API, así el reconocimiento no espera un viaje de red. La API recibe la decisión y mantiene la bitácora de visitas.
- **Un servicio nuevo junto al núcleo, no dentro de él.** Las invitaciones con QR salieron como un servicio en FastAPI con cambios mínimos en la API de Spring Boot, así la feature avanzó rápido sin desestabilizar un backend del que dependen 11 comunidades.
- **Infraestructura como código desde el inicio.** El stack serverless (Lambda, API Gateway, IoT Core, Secrets Manager) se despliega con AWS CDK, así los entornos son reproducibles y revisables.
- **Medir lo que se afirma.** El tiempo ahorrado en la caseta se respalda con métricas construidas a partir de eventos del sistema, no con estimaciones.
