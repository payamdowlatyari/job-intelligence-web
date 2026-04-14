# Job Intelligence Web

An AI-powered job intelligence platform built with Next.js. Browse jobs, match your resume, generate cover letters, and apply — all in one place.

## Features

- **Apply for Jobs** — Paste a job posting URL to parse it, preview the listing, match your resume, or generate a cover letter
- **Browse Jobs** — Search and filter jobs by keyword, company, location, and type with full CRUD (create, edit, delete)
- **Match Resume** — Upload or paste your resume and get AI-ranked job matches with similarity scores
- **Cover Letter** — Generate tailored cover letters by job ID or URL with tone and length options
- **Resume Persistence** — Save your resume text to localStorage with support for `.txt` and `.pdf` file uploads
- **Authentication** — GitHub and Google OAuth via Auth.js (NextAuth v5) with protected routes

## Tech Stack

| Layer         | Technology                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router, Turbopack)                                              |
| Language      | TypeScript 5                                                                                          |
| UI            | React 19, [Tailwind CSS 4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com) (shadcn/ui) |
| Icons         | [Lucide React](https://lucide.dev)                                                                    |
| Forms         | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)                               |
| Data Fetching | [TanStack React Query](https://tanstack.com/query)                                                    |
| Auth          | [Auth.js v5](https://authjs.dev) (next-auth beta)                                                     |
| PDF Parsing   | [pdf.js](https://mozilla.github.io/pdf.js/) (client-side)                                             |
| Backend       | FastAPI (separate repo)                                                                               |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home — hero + embedded apply workflow
│   ├── layout.tsx            # Root layout (Header, Footer, Providers)
│   ├── providers.tsx         # SessionProvider, QueryClient, ResumeProvider
│   ├── apply/page.tsx        # Apply page — URL ingest workflow
│   ├── jobs/
│   │   ├── page.tsx          # Browse & search jobs
│   │   ├── new/page.tsx      # Create a new job
│   │   └── [id]/page.tsx     # Job detail with edit & delete
│   ├── match/page.tsx        # Resume matching
│   ├── cover-letter/page.tsx # Cover letter generation
│   └── sign-in/page.tsx      # OAuth sign-in
├── components/
│   ├── Header.tsx            # Responsive navbar with mobile menu
│   ├── Footer.tsx            # Page links, social icons, copyright
│   ├── ApplyWorkflow.tsx     # Reusable URL ingest + match/cover-letter flow
│   ├── ResumeInput.tsx       # Textarea with file upload + localStorage
│   ├── JobCard.tsx           # Job listing card
│   ├── Spinner.tsx           # Loading spinner
│   ├── ErrorMessage.tsx      # Error display
│   ├── EmptyState.tsx        # Empty results message
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── utils.ts              # Utility functions (cn)
│   ├── auth.ts               # Auth.js config
│   ├── resume-context.tsx    # Resume React Context + localStorage
│   └── api/
│       ├── apiFetch.ts       # Central fetch utility
│       ├── jobs.ts           # Job CRUD API functions
│       ├── match.ts          # Resume matching API
│       ├── coverLetter.ts    # Cover letter generation API
│       └── ingest.ts         # URL ingestion API
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A running instance of the [Job Intelligence API](https://github.com/payamdowlatyari/job-intelligence) (FastAPI backend)

### Installation

```bash
git clone https://github.com/payamdowlatyari/job-intelligence-web.git
cd job-intelligence-web
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Auth.js
AUTH_SECRET=<generate with `npx auth secret`>
AUTH_GITHUB_ID=<your-github-oauth-app-id>
AUTH_GITHUB_SECRET=<your-github-oauth-app-secret>
AUTH_GOOGLE_ID=<your-google-oauth-client-id>
AUTH_GOOGLE_SECRET=<your-google-oauth-client-secret>
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## API Integration

The frontend communicates with a FastAPI backend at `/api/v1`. Key endpoints:

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| GET    | `/jobs`                  | List jobs with filters          |
| GET    | `/jobs/{id}`             | Get job by ID                   |
| POST   | `/jobs`                  | Create a job                    |
| PATCH  | `/jobs/{id}`             | Update a job                    |
| DELETE | `/jobs/{id}`             | Delete a job (204)              |
| POST   | `/match`                 | Match resume to jobs            |
| POST   | `/cover-letter`          | Generate cover letter by job ID |
| POST   | `/cover-letter/from-url` | Generate cover letter from URL  |
| POST   | `/ingest`                | Ingest job from URL             |

## License

MIT
