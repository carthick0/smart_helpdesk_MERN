# Smart Helpdesk with Agentic Triage

An end-to-end web application where users create support tickets and an AI coworker triages them by classifying, retrieving relevant knowledge-base (KB) articles, drafting replies, and either auto-resolving or assigning tickets to human agents.

---

## Architecture Overview

- **Frontend:** React with Vite, React Router, context-based authentication.
- **Backend:** Node.js (Express) with Mongoose for MongoDB.
- **Agentic Workflow:** AI triage implemented with deterministic stubs (no API keys needed).
- **Persistence:** MongoDB stores users, tickets, KB articles, agent suggestions, audit logs, and config.
- **Dockerized:** Backend, MongoDB,  with Docker Compose.

---

## Features

- User roles: Admin, Agent, User, with JWT authentication and role-based access control.
- Knowledge Base management with CRUD and publish/unpublish (Admin).
- Ticket lifecycle from creation, AI triage, to closure or human assignment.
- AI triage steps: classify, retrieve KB articles, draft reply, compute confidence, and decide auto-close or human action.
- Audit logs for traceability with trace IDs.
- Notifications stubs for status changes.
- Tests covering core backend and frontend flows.
- Docker Compose setup ensures easy local environment with `docker compose up`.

---

## Setup & Run

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (if developing locally without Docker)

### Environment Variables

Create a `.env` file or set environment variables as follows:
PORT=8000
MONGO_URI=<your_url>
JWT_SECRET=<your jwt code>
AUTO_CLOSE_ENABLED=true
CONFIDENCE_THRESHOLD=0.78
STUB_MODE=true
### Using Docker Compose

Build and start all services:

docker compose up --build



- Frontend accessible at [http://localhost:3000](http://localhost:3000)
- Backend API at [http://localhost:8000](http://localhost:8000)

### Running Tests

- Backend tests (Jest):

cd server
npm install
npm test



- Frontend tests (Vitest):

cd client
npm install
npm test


---

## Agentic Workflow Details

- **Planning:** Sequential workflow per ticket (classification → KB retrieval → draft → decision).
- **Classification:** Keyword rules in stub identify categories and generate confidence scores.
- **KB Retrieval:** Simple keyword search top 3 articles.
- **Draft Reply:** Predefined templated replies referencing KB titles.
- **Decision:** Auto-close if confidence above threshold and enabled, else assign human.
- **Audit Logs:** Immutable event logs with trace IDs for each stage.

---

## Development Notes

- Use STUB_MODE=true for local development without AI API keys.
- Proxy configured in Vite for API requests in development.
- Role-based UI and API security enforced.
- Polling or websocket recommended for real-time ticket status updates.
- Input validations in place (Zod/Joi recommended enhancements).
- Logs and audit trails support troubleshooting.

---

## Future Improvements (Optional)

- Real-time updates with WebSocket or SSE.
- SLA monitoring with automated escalations.
- Feedback loops for AI replies (thumbs up/down & retraining).
- Enhanced KB search (embedding or vector similarity).
- File attachments and content extraction for triage context.

---

## Contact & Support

For issues or questions, open an issue on GitHub or contact karthikeyavempala@gmail.com.

---

Thank you for exploring **Smart Helpdesk**, designed with clarity and AI-powered agentic triage!
