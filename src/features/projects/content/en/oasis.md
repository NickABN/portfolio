---
title: "Oasis App"
year: 2026
deck: "A marketplace for renting stadium boxes and VIP seats in Mexico. I joined a struggling team, built the Stripe checkout and helped the platform hold up under World Cup traffic."
role: "Full-stack developer (team)"
stack: ["Flutter", "React", "Python", "GraphQL", "Redis", "Stripe"]
status: live
featured: true
order: 1
liveUrl: "https://play.google.com/store/apps/details?id=com.oasisapp.user"
client: true
---

## The problem

Oasis lets fans rent boxes and VIP seats at Mexico's main venues: football, baseball, concerts, F1, NFL and NBA events. Box owners list their spaces; guests browse, book and pay from a Flutter app or the web. The app has passed 5,000 downloads on Google Play and is also on the App Store.

I joined a team that was already shipping but struggling: an app that had started in FlutterFlow, a long-lived API handed across several teams, and deadlines that kept slipping. My job was to help clear the water.

## What I built

- **The Stripe payment flow** in the mobile app, end to end.
- **Part of the app's refactor** to BLoC and Clean Architecture, both in its early stage and later as the codebase matured.
- **The web front end, when deliveries became urgent:** wiring the user flows, handling user types in the UI, and box creation and editing for owners.
- **A small suggestions system on GraphQL** to lift sales conversion: when a search found no matching event, the user saw similar events instead of an empty page.
- **Urgent features for offer management,** and performance work on the purchase flow in both the web and the mobile app.
- **Performance work for the World Cup.** On day one the platform was not ready to scale. The web app, which runs on its own back end, could serve only about 25 concurrent users. I took part in the analysis and the fixes: back-end and query optimisation, a Redis cache, and a rework of the web app's state management after I found a page firing around 40 requests on load. On the same instance size, the web app went from about 25 to 150 concurrent users. The mobile app, already optimised, scales on a different path.
- **The Bad Bunny concerts** came next and needed only a few fixes, because the work done for the World Cup held up.

## Decisions

- **Fix the request pattern before scaling the server.** The bottleneck was not only capacity: a single page fanned out into dozens of calls. Reshaping what the front end asks for removed load that more instances would only have absorbed.
- **Cache what does not change per user,** and optimise the hot queries in the purchase flow first, since that is where traffic and revenue meet.
- **Schedule vertical scaling around big events.** The lasting lesson: the instance is scaled up ahead of each major event instead of reacting once traffic arrives.
- **Never show an empty result.** A search with no exact match is a lost sale; suggesting similar events keeps the user in the purchase flow.
- **Refactor while shipping.** Moving to BLoC and Clean Architecture in steps let the team keep delivering instead of freezing features for a rewrite.
