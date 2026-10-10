---
title: "UrbanRisk Analytics"
year: 2026
deck: "Predecir el riesgo de accidentes viales en la Ciudad de México con tres años de datos del C5, y reportar con honestidad dónde está el techo."
role: "Científico de datos (equipo de TFM)"
stack: ["Python", "pandas", "scikit-learn", "LightGBM", "XGBoost", "SHAP"]
status: archived
featured: false
repoUrl: "https://github.com/NickABN/urbanrisk-analytics"
---

## El problema

El C5 de la Ciudad de México registra cada incidente vial reportado a emergencias. La pregunta de nuestro Trabajo Final de la Maestría en Análisis y Visualización de Datos Masivos en UNIR México: ¿puede ese registro anticipar dónde y cuándo se concentra el riesgo, para ayudar a asignar recursos? El problema es que el registro solo contiene eventos. No existe clase negativa, así que «accidente / no accidente» no se puede aprender directamente.

## Qué construí

Un pipeline reproducible, ejecutable de punta a punta con un solo comando o por etapas:

- **Reformular la unidad de análisis.** Una rejilla completa alcaldía × día × franja horaria (50,560 filas, 18.57 % de celdas en cero) reconstruida a partir de un registro de solo eventos, con el conteo discretizado en tres niveles de riesgo.
- **Patrones espaciotemporales** con K-Means y DBSCAN sobre métrica haversine.
- **Clasificación del riesgo** comparando XGBoost, LightGBM, Random Forest, regresión logística multinomial y un perceptrón multicapa, más un ensamble por votación suave; SARIMA para el volumen diario; SHAP sobre LightGBM para la interpretabilidad.
- **Una rejilla de predicción precalculada** que alimenta un tablero de inteligencia territorial.

## Decisiones

- **Validación estrictamente cronológica.** `TimeSeriesSplit` para el ajuste y un hold-out por fecha para la evaluación final. Un corte aleatorio sobre una serie temporal le deja ver el futuro al modelo.
- **Umbrales calculados solo sobre entrenamiento,** y variables de retardo que miran estrictamente hacia atrás, para que nada se filtre desde el conjunto de prueba.
- **Reportar el resultado incómodo.** El techo de F1 macro (≈ 0,67) resultó estructural, no algorítmico: diez variables de retardo, la hipótesis de partida, aportaron apenas un 2,1 % relativo. La ablación muestra que el dónde-y-cuándo y el qué-pasó-ayer cargan en gran medida la misma información. Más modelo no arregla eso.
- **Reproducir antes de confiar en el texto.** Volver a ejecutar el pipeline detectó una cifra de sobredispersión del documento calculada sobre la agregación equivocada; el registro de decisiones documenta la corrección.
