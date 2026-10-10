---
title: "MYFRAC"
year: 2024
deck: "A residential community platform with facial and QR access control over IoT, mobile apps for residents and guards, and a WhatsApp assistant that handles about 7,000 visitor accesses a month."
role: "Full-stack developer & squad tech lead"
stack: ["Python", "FastAPI", "Java", "Spring Boot", "AWS IoT Core", "DynamoDB", "Flutter"]
status: live
featured: true
order: 2
highlights:
  - value: "11"
    label: "Residential communities"
  - value: "~5,000"
    label: "Active users"
  - value: "4–10 → 1–3 min"
    label: "Visitor handling time"
---

## The problem

Gated residential communities need to know who comes in, who invited them and when. Before automation, guards and residents coordinated each visitor by hand, and a single visit could take 4 to 10 minutes to process at the gate.

MYFRAC runs in 11 residential communities in Mexico and Honduras, with around 5,000 active users: residents, guards and administrators.

## What I built

I own most of the platform end to end: the infrastructure, the Java back end, the residents' and guards' mobile apps, the web admin panels and the residents' WhatsApp chatbots.

- **The core Spring Boot back end,** backed by AWS Lambda functions for asynchronous work, with CSV, Excel and PDF reports in Python and Java.
- **Access control over MQTT.** Gate devices — facial recognition terminals and QR scanners — connect through AWS IoT Core. Access events flow through EventBridge to Lambda and land in DynamoDB, and faces and QR codes are managed on the devices over the same channel.
- **The residents' WhatsApp assistant,** built on Botmaker with LLM-based language understanding (OpenAI and Anthropic). It handles about 7,000 automated visitor accesses a month and cut handling time from 4–10 minutes to 1–3, measured with operational metrics I implemented.
- **The guards' and residents' Flutter apps** for iOS and Android, and the web panels administrators use to run each community.
- **QR invitations, end to end:** the conversation flow, a new FastAPI service, changes to the Spring Boot API for compatibility, the Flutter QR-scanning app for the gate, and the AWS deployment with CDK.
- **Security for devices and people:** HMAC signatures to authenticate the IoT devices against the API, and the platform's own OAuth2 login and token flow with Spring Security.


## Decisions

- **Events, not polling, for access.** Devices publish once and the cloud routes the event. EventBridge decouples the gate from whatever consumes the event next.
- **A new service beside the core, not inside it.** QR invitations shipped as a FastAPI service with small changes to the Spring Boot API, so the feature moved fast without destabilising a backend that 11 communities depend on.
- **Infrastructure as code from the start.** The serverless stack (Lambda, API Gateway, DynamoDB, EventBridge, IoT Core, S3, Secrets Manager) is deployed with AWS CDK, so environments are reproducible and reviewable.
- **Measure the claim.** The time saved at the gate is backed by metrics built from system events, not by estimates.
