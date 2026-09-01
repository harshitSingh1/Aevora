# CareLedger

CareLedger is a patient advocacy platform that connects healthcare bills, evidence, insurance context, care options, and actionable next steps.

## The Problem

Healthcare bills are incredibly complex, and patients often struggle to understand the charges on their final bills. When financial discrepancies or unexpected items appear, they are difficult to identify and verify against original estimates and medical records. Insurance coverage details can be equally confusing, leaving patients unsure of what questions to ask or how to advocate for themselves when mistakes happen.

## The Solution

**Understand -> Verify -> Ask -> Act**

CareLedger provides a transparent experience for patients to make sense of their medical journey. It offers:
- Detailed financial analysis
- Clear evidence connections
- Relevant insurance context
- Insightful care option comparison
- Guided advocacy questions
- Interactive "Talk to CareLedger" voice and chat
- Concrete action plans
- Downloadable evidence packs

## Key Differentiator

CareLedger is not simply an OCR bill reader or a generic medical chatbot. It is a **patient advocacy layer** connecting financial findings directly to concrete evidence and actionable, guided conversations.

## Features

- **Financial Drift:** Track changes between estimates and final bills.
- **Care Timeline:** Understand the chronological flow of treatments.
- **CareFlow:** Visualizing the patient journey step-by-step.
- **Evidence-aware Findings:** Link line items to source documents.
- **Insurance Reconciliation:** Contextualize costs against covered approvals.
- **Care Options:** Explore synthetic benchmark data and alternatives.
- **Advocacy Center:** Plan and track questions for doctors or billing departments.
- **Talk to CareLedger:** A simulated call experience for conversational guidance.
- **Action Plans:** Convert discussions into concrete tasks.
- **Evidence Packs:** Consolidate data for offline or written discussions.
- **Demo Mode:** Fully functional synthetic local environment.

## Architecture

```text
Next.js
   ↓
CareLedger Application
   ↓
Shared Case Context
   ├── Timeline
   ├── Financial Intelligence
   ├── Insurance
   ├── Care Options
   ├── Advocacy
   └── Talk
          ├── Mock AI
          ├── Featherless
          ├── Browser Speech
          └── ElevenLabs
```

## Tech Stack

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)
- **Recharts** (Data Visualization)
- **Framer Motion** (Animations)
- **Featherless Integration** (Planned / Configurable)
- **ElevenLabs Integration** (Planned / Configurable)

## Quick Start

```bash
git clone <repository-url>
cd <project-directory>
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and choose **Explore Demo**.

*(Note: On Windows, you can manually copy `.env.example` to `.env.local` if `cp` is not available.)*

## Demo Mode

By setting `DEMO_MODE=true` in your environment, you unlock:
- No API keys required
- Synthetic case data out-of-the-box
- Mock AI chat responses
- Browser speech synthesis / Mock voice fallback
- A complete, end-to-end demo flow without configuration

## API Mode

```env
DEMO_MODE=false
FEATHERLESS_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
```
*(Note: Secrets must always remain server-side. Do not expose them with `NEXT_PUBLIC_` prefixes.)*

## Environment Variables

| Variable            | Required            | Purpose                 |
| ------------------- | ------------------- | ----------------------- |
| DEMO_MODE           | Yes                 | Enables local demo mode |
| FEATHERLESS_API_KEY | Only for AI mode    | AI responses            |
| ELEVENLABS_API_KEY  | Only for voice mode | Voice synthesis         |
| NEXT_PUBLIC_APP_URL | Recommended         | Application URL         |

## Demo Walkthrough

1. Open **Demo Case**
2. Open **Financial Analysis**
3. Select **Additional Procedure - ₹28,000**
4. View evidence
5. Open **Advocacy**
6. **Talk to CareLedger**
7. Ask *"Why was this charge added?"*
8. Add action to plan
9. Create **Evidence Pack**

## Responsible AI

CareLedger:
- **Does not diagnose** patients.
- **Does not replace** professionals (doctors, billing staff, insurance agents).
- **Does not automatically declare fraud** or malpractice.
- **Does not guarantee** insurance coverage.
- Distinguishes clearly between factual evidence and interpretation.
- Uses synthetic data in **Demo Mode**.

## Project Structure

```text
src/
├── app/               # Next.js App Router pages
├── components/        # React components (Dashboard, CareLedger, Layout)
├── lib/               # Utilities, Contexts, and Mock Data
├── services/          # Abstracted logic (AI, Voice, Advocacy)
└── types/             # TypeScript interfaces
```

## Testing & Quality Assurance

Available commands:
```bash
npm run build
npm run lint
```
(A successful build ensures type safety and production readiness).

## Deployment

CareLedger is designed as a Next.js application, easily deployable to Vercel or any Node.js hosting provider. Ensure your production environment variables are properly configured without hardcoding credentials in the repository.

## Synthetic Data Disclaimer

All patient, hospital, billing, insurance, and care-option information used in the demo is synthetic and created exclusively for demonstration purposes.
