# FDE OS — AI-Native Workspace for Forward-Deployed Engineering

**FDE OS** is an enterprise-grade operational workspace designed specifically for Forward-Deployed Engineers (FDEs), Solutions Engineers, Technical customer deployment coordinators, and leadership teams. It helps B2B AI/software companies scale high-touch customer delivery without complex integrations on day one.

## Core Value Proposition (Demo Walkthrough)

In a live investor or CTO presentation, FDE OS is designed to address a critical pain: **scattered client context**. The workspace demonstrates the entire lifecycle:
1. **Manual Workspace Setup**: Spin up distinct customer pipelines instantly in seconds.
2. **Notes Intelligence (Central Value)**: Paste unstructured meeting transcripts or phone logs. Watch the system perform simulated classification parsing to isolate actual obligations, people, issues, and threat risks.
3. **Reactive Approval Loops**: Inspect extracted entities. Accept or reject them to write them directly back into the live ledger.
4. **Command Command Center**: Comprehensive metrics on pipeline progress, contract ARR exposure, active blockers, and glowing SVG statistics.

---

## Technical Stack & Architectural Design

- **Runtime Environment**: React 18+ (React 19 native support), Vite, TypeScript.
- **Styling Architecture**: Tailwind CSS.
- **Routing Engine**: Custom hash-based hash navigation listener (`window.location.hash`). This establishes robust iframe caching integrity, deep-linking, back/forward history navigation, and zero server redirection blocks.
- **No Third-Party Package Overhead**: Visualizers (Health doughnuts and progress bars) are implemented as interactive, high-contrast SVG objects, securing high responsiveness under React 19 rules.

---

## Demo View and API View

The frontend now has two data modes:

- **Demo View** keeps all current mock data and sandbox role behavior.
- **API View** uses the backend at `VITE_API_BASE_URL` for auth, dashboards, engagements, extraction, ledgers, readiness, product signals, and status updates.

Create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5055/api
```

Seeded backend demo credentials:

- `admin@example.com`
- `manager@example.com`
- `fde@example.com`
- password: `Password123!`

## How to Run & Build

To boot up development parameters locally or deploy production bundles, utilize standard npm directives:

```bash
# 1. Install frontend dependencies
npm install

# 2. Start the backend in a second terminal after backend/.env is configured
cd ../backend
npm run seed
npm run dev

# 3. Boot up local frontend development server (port 3000 is default)
cd ../frontend
npm run dev

# 4. Compile final static distribution bundle matching production standards
npm run build
```

Troubleshooting:

- If API View redirects to login, seed the backend and log in with the demo credentials above.
- If API calls fail, confirm `backend/.env` has `PORT=5055`, `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL=http://localhost:3000,http://localhost:3001`.
- If Vite/Tailwind reports native binding issues, rerun `npm install` inside `frontend/`.

---

## Modular Layout Pages Map

- **`/` (Dashboard / Command Center)**: Unified view displaying critical threat alerts, aggregated indicators, and the list of active engagements.
- **`/engagements` (Directory)**: Directory filtering by stages, health factors, or leads.
- **`/engagements/:id` (Detail Workspace)**: Core operator screen containing Overview timeline trackers, Notes Intelligence, Commitments, Risks, Feedbacks, and automated newsletter Updates generators.
- **`/product-intelligence` (Product Alignment)**: Collective field signal aggregator showing ARR exposure cases.
- **`/playbooks` (Runbooks handbook)**: Standardized checklist directories.
