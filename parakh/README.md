# Parakh — Merchant Intelligence

**Parakh** is a data-driven merchant intelligence platform that analyzes real transaction data to evaluate merchant health, detect suspicious transaction patterns, identify potential fraud, and explain the factors behind each merchant score.

Inspired by the traditional Indian *kasauti* (touchstone) used to test gold, Parakh evaluates merchants through a transparent scoring system rather than relying on a single black-box prediction.

### Key Features

* 📊 **Merchant Health Score** — evaluates merchants using transaction and business performance signals.
* 🔍 **Fraud & Anomaly Detection** — identifies unusual transaction patterns and potentially suspicious activity.
* 🕸️ **Transaction Network Analysis** — detects circular money movement and relationships between accounts.
* 📈 **Business Trend Analysis** — analyzes sales, refunds, failed payments, settlements, and transaction trends.
* 🧪 **Pathar Test / What-If Analysis** — lets users simulate stress conditions and see how merchant scores may change.
* 💡 **Explainable Insights** — shows why a merchant received a particular score with supporting transaction-level evidence in English and Hindi.
* 🔎 **Natural-Language Queries** — users can describe what they want to investigate and generate relevant workflows.
* ⚙️ **Workflow-Based Analysis** — transaction loading, validation, scoring, graph analysis, and dashboard generation organized into an interactive workflow.
* 🇮🇳 **Indian Transaction Data** — designed to work with Indian/UPI transaction datasets alongside merchant transaction metrics.

---

### Tech Stack

* **Frontend:** React 18, Vite, Tailwind CSS
* **Routing:** React Router v7
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **Speech:** Web Speech API (Hindi / English TTS support)
* **Data Storage:** Client-side bundled JSON datasets (`realData.json`, `indiaData.json`)

---

## Local Setup & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

3. **(Optional) Re-generate / Bootstrap Data**:
   If you supply raw dataset files in `data/olist/`, run:
   ```bash
   npm run prepare:data
   ```

---

## Environment Variables

Copy `.env.example` to `.env`:

| Variable | Description | Default | Required for Production? |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Optional Anthropic API Key for external AI models | `None` | No (Optional) |
| `OLIST_BASE_URL` | Dataset download mirror URL for data scripts | `https://raw.github...` | No (Optional) |
| `OLIST_ALLOW_DOWNLOAD` | Allow automatic dataset downloading during script execution | `0` | No (Optional) |

*Note: The frontend operates fully client-side without mandatory backend API keys.*

---

## Build for Production

```bash
npm run build
```

- **Output directory:** `dist/`
- The pre-built dataset in `src/data/realData.json` is bundled into Vite static assets automatically.

---

## Deploying to Vercel (GitHub → Vercel)

### Step 1: Push Code to GitHub
Ensure all your files (including `vercel.json` and prebuilt `src/data/*.json`) are committed:
```bash
git add .
git commit -m "Prepare Parakh for Vercel deployment"
git push origin main
```

### Step 2: Import Project on Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your GitHub repository (`parakh`).
4. Keep the default settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.

`vercel.json` is included in the project to rewrite all SPA paths to `/index.html` so direct link navigation and page refreshes work properly.
