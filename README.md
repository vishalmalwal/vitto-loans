# Vitto Loans — Modern Fintech Loan Application Portal

Vitto Loans is a production-ready, full-stack loan application portal engineered with React + Vite on the frontend and Node.js + Express on the backend. This application features custom automated numerical counting animations, interactive glassmorphism components, floating aurora background loops, dynamic responsive tables, and multi-language communication streams backed by a powerful dual PostgreSQL or Local JSON database persistence engine.

## 🔗 Preview Details

- **Local Dev Server Origin**: http://localhost:3000

---

## 🛠️ Tech Stack Summary

- **Frontend**: React (v19), Vite (v6), Tailwind CSS (v4), Axios, Lucide React Icons
- **Backend**: Node.js, Express.js, TypeScript, TSX Runner, ESBuild Bundler
- **Database**: PostgreSQL (pg pool parameterized querying) with automated JSON-file storage persistence fallback when credentials are absent
- **Theming**: System-responsive Sun/Moon persistent theme manager utilizing custom global CSS variables

---

## 🗄️ Database Schema & File Migrations

A SQL schema migration descriptor is located under `migrations/001_init.sql`:

```sql
CREATE TABLE IF NOT EXISTS applications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  mobile     VARCHAR(15) NOT NULL,
  amount     NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  purpose    VARCHAR(255) NOT NULL,
  language   VARCHAR(20) NOT NULL CHECK (language IN ('Hindi','Tamil','Telugu','Marathi','English')),
  status     VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 🔌 REST API Endpoints Reference

All request payloads and error feedback are managed structured as solid JSON structures.

| Method    | Path                           | Description                            | Spec Requirements                                                                         |
| :-------- | :----------------------------- | :------------------------------------- | :---------------------------------------------------------------------------------------- |
| **POST**  | `/api/applications`            | Create a new loan application          | Requires `name`, `mobile` (10 digits), `amount` (>0), `purpose` (>= 10 chars), `language` |
| **GET**   | `/api/applications`            | Dynamic list of application index      | Accepts filter param `?status=pending\|approved\|rejected`                                |
| **PATCH** | `/api/applications/:id/status` | Update approval evaluate status        | Only values `"approved"` or `"rejected"` are accepted                                     |
| **GET**   | `/api/summary`                 | Query aggregate stats                  | Performance counts and totals computed in a single SQL step                               |
| **GET**   | `/api/db-status`               | Developer database configuration state | Returns details about PostgreSQL vs JSON fallback mode                                    |

---

## 🚀 Local Operations & Installation Steps

Follow these steps to run Vitto Loans locally:

### 1. Close repository and navigate to root:

```bash
git clone <repository_url> vitto-loans
cd vitto-loans
```

### 2. Configure Environment variables:

Create a `.env` file in the root copying `.env.example`:

```env
# Database connection string for PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/vittoloans
NODE_ENV=development
```

_Note: If no database URL is supplied, the system seamlessly fallbacks to local stateful JSON persistence so developers can instantly experiment with application workflows without any DB overhead._

### 3. Install NPM packages:

```bash
npm install
```

### 4. Boot Project (Local Development):

Starts the robust Express + Vite bundle collectively in a single execution flow:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser.

---

## 🔧 Local Development Troubleshooting Tips

### 🌟 Parent Folder PostCSS Conflict (Windows Downloads / Dev Folders)

On Windows environments, if you run the server inside personal folders (like `C:\Users\<Name>\Downloads`) and encounter errors such as:
`Error: Loading PostCSS Plugin failed: Cannot find module 'autoprefixer'`

**Our Solution**: The project's `vite.config.ts` has been updated to bypass recursive directory searches for stray `.postcss.json` or `postcss.config.js` files by explicitly isolating stylesheet build options:

```ts
css: {
  postcss: {
    plugins: []
  }
}
```

### 🌟 PostgreSQL Environment Variables Resolution

If you see logs mentioning `No DATABASE_URL found in environment. Falling back to local JSON persistence`, ensure your `.env` file is present directly in the project root directory. We've optimized `server.ts` and `backend/src/db.ts` to boot `dotenv` immediately upon startup, guaranteeing your Postgres cluster pools correctly!

### 5. Build and Run Production Compilation:

```bash
npm run build
npm start
```

---

## ✨ Future Enhancements & Improvement Roadmap

With additional development time, here are the target features I would prioritize:

1. **Interactive Document Submissions**: Incorporating a secure drag-and-drop file upload feature for identity cards and income certificates, backed by cloud storage.
2. **Automated Risk Engine**: Running a server-side credit check or using the Gemini API to analyze the applicant's purpose statement and assign a risk rating before review.
3. **Automated Database Setup**: Creating an automated schema synchronization script that runs `migrations/001_init.sql` automatically upon server initialization if PostgreSQL tables are absent.
