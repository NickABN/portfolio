---
title: "Oasis App"
year: 2026
deck: "Un marketplace para rentar palcos y asientos VIP en estadios de México. Me sumé a un equipo con problemas, construí el checkout con Stripe y ayudé a que la plataforma aguantara el tráfico del Mundial."
role: "Desarrollador full-stack (equipo)"
stack: ["Flutter", "React", "Python", "GraphQL", "Redis", "Stripe"]
status: live
featured: true
order: 1
liveUrl: "https://play.google.com/store/apps/details?id=com.oasisapp.user"
client: true
cover: ../images/oasis-card.es.svg
coverFit: contain
coverAlt: "Clientes Flutter y React llaman a una API REST en Node y Express sobre Elastic Beanstalk, que guarda reservas y pagos de Stripe en MySQL en una sola transacción. La API verifica cada cobro de Stripe. La web pasó de 25 a 150 usuarios concurrentes en la misma instancia."
caption: "Cómo se hace una reserva y la cifra que importó a escala Mundial."
figures:
  - src: ../images/oasis-architecture.es.svg
    alt: "Diagrama de arquitectura: los clientes Flutter y React llaman a una API REST en Node y Express sobre Elastic Beanstalk, que guarda reservas y pagos de Stripe en MySQL y notifica a los huéspedes; un panel de administración en Angular usa un servicio GraphQL."
    caption: "Cómo se hace una reserva: huéspedes, una API REST, una transacción."
    kind: diagram
highlights:
  - value: "25 → 150"
    label: "Usuarios web concurrentes, misma instancia"
  - value: "5,000+"
    label: "Descargas en Google Play"
  - value: "~40"
    label: "Peticiones de una sola página al cargar"
---

## El problema

Oasis permite rentar palcos y asientos VIP en los principales recintos de México: fútbol, béisbol, conciertos, F1, NFL y NBA. Los dueños publican sus palcos; los invitados exploran, reservan y pagan desde una app en Flutter o desde la web. La app superó las 5,000 descargas en Google Play y también está en la App Store.

Me sumé a un equipo que ya estaba entregando pero con muchos problemas: una app que había nacido en FlutterFlow, una API de larga vida que pasó por varios equipos y plazos que se seguían corriendo. Mi trabajo fue ayudar a aclarar el agua.

## Qué construí

- **El flujo de pago con Stripe** en la app móvil, de punta a punta.
- **Parte del refactor de la app** hacia BLoC y Clean Architecture, tanto en su etapa inicial como cuando el código ya estaba madurando.
- **El front web, cuando las entregas se volvieron urgentes:** conexión de los flujos de usuario, manejo de los tipos de usuario en la interfaz, y creación y edición de palcos para los dueños.
- **Un pequeño sistema de sugerencias sobre GraphQL** para mejorar la conversión de ventas: cuando una búsqueda no encontraba el evento, el usuario veía eventos similares en lugar de una página vacía.
- **Features urgentes para la gestión de ofertas,** y mejoras de rendimiento en el flujo de compra tanto en la web como en la app móvil.
- **Rendimiento para el Mundial.** El primer día la plataforma no estaba lista para escalar. La web, que corre sobre su propio backend, soportaba solo unos 25 usuarios simultáneos. Participé en el análisis y en las correcciones: optimización del backend y de las queries, caché con Redis y una mejora del manejo de estado de la web después de detectar una página que disparaba alrededor de 40 peticiones al cargar. Con el mismo tamaño de instancia, la web pasó de unos 25 a 150 usuarios simultáneos. La app móvil, ya optimizada, escala por otro camino.
- **Los conciertos de Bad Bunny** vinieron después y solo requirieron unos pocos ajustes, porque el trabajo hecho para el Mundial se sostuvo.

## Decisiones

- **Corregir el patrón de peticiones antes de escalar el servidor.** El cuello de botella no era solo capacidad: una sola página se abría en decenas de llamadas. Cambiar lo que pide el front eliminó carga que más instancias solo habrían absorbido.
- **Cachear lo que no cambia por usuario,** y optimizar primero las queries calientes del flujo de compra, porque ahí se cruzan el tráfico y los ingresos.
- **Programar el escalado vertical para los grandes eventos.** El aprendizaje que quedó: la instancia se escala antes de cada evento importante en lugar de reaccionar cuando ya llegó el tráfico.
- **Nunca mostrar un resultado vacío.** Una búsqueda sin coincidencia exacta es una venta perdida; sugerir eventos similares mantiene al usuario en el flujo de compra.
- **Refactorizar sin dejar de entregar.** Migrar a BLoC y Clean Architecture por etapas permitió que el equipo siguiera entregando en lugar de congelar features por una reescritura.
