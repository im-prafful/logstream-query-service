# LogStream - Query Service 🔍

A NodeJS microservice that provides a secure and efficient API for querying and retrieving structured log data from the database.

This service acts as the backend-for-frontend (BFF), serving all data required by the LogStream dashboard. It exposes endpoints for searching, filtering, and aggregating log data, ensuring the frontend remains decoupled from the underlying database schema.

---

### Key Features

- **Secure API**: Protects data access with proper authentication and authorization.
- **Optimized Queries**: Built for efficient reading and aggregation of log data from PostgreSQL.
- **Data Pagination**: Implements pagination to handle large datasets gracefully.
- **Caching Layer**: (Future) Will integrate Redis to cache frequent queries for lower latency.

### Tech Stack

- **Framework**: NodeJS
- **Containerization**: Docker
- **Deployment**: AWS Lamda
- **Database**: PostgreSQL (via RDS)

---


