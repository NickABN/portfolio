---
title: "UrbanRisk Analytics"
year: 2026
deck: "Predicting road-accident risk in Mexico City from three years of C5 emergency data — and reporting honestly where the ceiling is."
role: "Data scientist (master's thesis team)"
stack: ["Python", "pandas", "scikit-learn", "LightGBM", "XGBoost", "SHAP"]
status: archived
featured: false
repoUrl: "https://github.com/NickABN/urbanrisk-analytics"
---

## The problem

Mexico City's C5 logs every road incident reported to emergency services. The question for our master's thesis at UNIR: can that record predict where and when risk concentrates, to help allocate resources? The catch is that the log only contains events. There is no negative class, so "accident / no accident" cannot be learned from it directly.

## What I built

A reproducible pipeline, run end to end with one command or stage by stage:

- **Reframing the unit of analysis.** A complete grid of borough × day × time slot (50,560 rows, 18.57% zero cells) rebuilt from an event-only log, with counts binned into three risk levels.
- **Spatio-temporal patterns** with K-Means and DBSCAN on a haversine metric.
- **Risk classification** comparing XGBoost, LightGBM, Random Forest, multinomial logistic regression and a multilayer perceptron, plus a soft-voting ensemble; SARIMA for daily volume; SHAP on LightGBM for interpretability.
- **A precomputed prediction grid** that feeds a territorial intelligence dashboard.

## Decisions

- **Strictly chronological validation.** `TimeSeriesSplit` for tuning and a date-based hold-out for the final score. A random split on a time series lets the model see the future.
- **Thresholds fitted on training data only,** and lag features that look strictly backwards, so nothing leaks from the test set.
- **Report the uncomfortable result.** The macro F1 ceiling (≈ 0.67) turned out to be structural, not algorithmic: ten lag features, the thesis's starting hypothesis, added only 2.1% relative. The ablation shows that where-and-when and what-happened-yesterday carry largely the same information. More model does not fix that.
- **Reproduce before you trust the text.** Re-running the pipeline caught an over-dispersion figure in the thesis computed on the wrong aggregation; the decision log records the correction.
