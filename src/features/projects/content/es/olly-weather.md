---
title: "Olly Weather"
year: 2026
deck: "Una app del clima en Flutter Web con autenticación, hecha para mostrar cómo las pequeñas decisiones de arquitectura mantienen honesta una demo y fácil de crecer."
role: "Único desarrollador"
stack: ["Flutter", "Dart", "Riverpod", "go_router"]
status: live
featured: false
liveUrl: "https://olly-olly-weather.netlify.app"
repoUrl: "https://github.com/NickABN/olly-weather-app"
cover: ../images/olly-weather-cover.webp
coverFit: contain
coverAlt: "Olly Weather en un teléfono: la pantalla de inicio de sesión y el pronóstico de Morelia, México, con viento, humedad, lluvia, índice UV, calidad del aire y una franja por horas que termina en tormenta por la tarde."
caption: "Inicio de sesión con la cuenta demo y, enseguida, el clima en vivo del lugar donde estás."
---

## El problema

Una app pequeña —iniciar sesión y ver el clima donde estás— es fácil de construir con descuido. El objetivo fue hacerla como empezaría un producto real: sin llaves que filtrar, sin secretos en texto plano y con una capa de autenticación que pueda pasar a un backend real sin tocar la interfaz.

## Qué construí

Una app en Flutter Web con login y registro, un guard de rutas que redirige a los usuarios no autenticados y el clima en vivo desde Open-Meteo. Está organizada por feature (`auth`, `weather`), cada una dividida en data, domain y presentation, con Riverpod para el estado y go_router para la navegación.

## Decisiones

- **Open-Meteo, sin API key.** Nada que filtrar en un repo público, CORS nativo para Flutter Web y cualquiera puede clonarla y ejecutarla. El costo: los códigos de clima WMO necesitan una tabla de traducción local.
- **Credenciales hasheadas, sesión en memoria.** Las contraseñas se guardan solo como hash bcrypt y ningún token se escribe en el almacenamiento del navegador, lo que elimina una sesión robable por XSS a cambio de volver a iniciar sesión al recargar. En producción el servidor haría el hash (Argon2id) y la sesión viviría en una cookie `HttpOnly`.
- **Stale-while-revalidate.** La última lectura se muestra al instante mientras una petición nueva la actualiza, así el usuario nunca se queda mirando un spinner.
- **Depender de una interfaz.** La app habla con un `AuthRepository`, así que pasar del almacenamiento en memoria a un backend real como Supabase es un cambio de una línea.
