# 📊 AI Data Analyst Dashboard

<div align="center">

![AI Data Analyst Dashboard](https://img.shields.io/badge/AI%20Data%20Analyst-Dashboard-0ea5e9?style=for-the-badge&logo=chartdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq-LLaMA%203.3-F55036?style=for-the-badge&logo=meta&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Turn any CSV file into instant AI-powered charts, insights, and analytics — no coding required.**

[🚀 Live Demo](https://your-app.vercel.app) · [📁 Repository](https://github.com/SaharshPatel2112/ai-data-analyst) · [🐛 Report Bug](https://github.com/SaharshPatel2112/ai-data-analyst/issues)

</div>

## 🎯 Introduction

**AI Data Analyst Dashboard** is a full-stack web application that allows anyone — technical or non-technical — to upload a CSV file and instantly get meaningful insights, visualizations, and AI-powered analysis through a conversational chat interface.

Traditional data analysis requires knowledge of tools like Excel, Python, or SQL. This project eliminates that barrier entirely. A user simply:

1. **Uploads** any CSV file
2. **Asks questions** in plain English — *"How many students failed?"*, *"Show me the sales trend"*
3. **Gets instant charts** — bar, line, pie, area charts generated automatically
4. **Receives AI insights** — smart summaries written in plain language

This project combines **React frontend**, **Node.js backend**, and **Groq's LLaMA 3.3 AI model** to create a real-world analytics tool comparable to enterprise BI software — built from scratch.

> 💡 **Key Differentiator:** Unlike static dashboards, this app understands natural language. You don't click through menus — you just *talk* to your data.

---

## 💡 Use Cases

### 1. 🏫 Education Analytics
Upload student records and instantly answer:
- *"How many students failed this semester?"*
- *"Which course has the highest failure rate?"*
- *"Show enrollment growth from 2023 to 2026"*

### 2. 🛍️ E-Commerce & Sales
Upload sales data and ask:
- *"Show top 5 products by revenue"*
- *"What is the monthly sales trend?"*
- *"Which region has the highest sales?"*

### 3. 💰 Finance & Accounting
Upload financial reports:
- *"What is the average transaction value?"*
- *"Show expense distribution by category"*
- *"Compare Q1 vs Q2 performance"*

### 4. 🏥 Healthcare
Upload patient or hospital data:
- *"How many patients were admitted per month?"*
- *"Show distribution of diagnoses"*
- *"What is the average age of patients?"*

### 5. 📊 Business Intelligence
Replace expensive BI tools for small teams:
- *"Show distribution by department"*
- *"Which product category drives most revenue?"*
- *"Generate a summary of this data"*

### 6. 🔬 Research & Surveys
Upload survey responses:
- *"What percentage responded Yes?"*
- *"Show distribution of age groups"*
- *"Which option was most popular?"*

---

## 🏢 Industry Value

### Market Context
The global **Business Intelligence market** is valued at **$33.3 billion (2024)** and growing at 8.7% annually. Tools like Power BI cost **$10-20/user/month**. This project demonstrates how AI can democratize data analysis.

### Why This Project Matters

| Traditional Approach | This Dashboard |
|---------------------|----------------|
| Need Python/SQL knowledge | Plain English questions |
| Hours to build charts | Seconds |
| $10-20/month per user | Free & open source |
| Rigid, pre-built reports | Dynamic, conversational |
| Only for technical teams | Anyone can use it |

### Comparable Industry Tools

| Tool | Price | Our Advantage |
|------|-------|---------------|
| Power BI (Microsoft) | $10/user/month | Free, AI-native |
| Tableau | $70/user/month | Conversational UI |
| ChatGPT Data Analysis | $20/month | Self-hosted, customizable |
| Looker Studio | Free (limited) | AI chat interface |

### ⭐ Project Rating: 9/10

**Why high value:**
- Combines the 3 most demanded skills: AI + Data + Full Stack
- Demonstrates system design: file handling → AI processing → visualization
- Can be converted into a SaaS product
- Matches the fastest growing domain: AI + Analytics

---

## 👥 Roles & Who Benefits

### Who Uses This Project?

| Role | How They Benefit |
|------|-----------------|
| **Business Analyst** | Get instant data summaries without writing SQL |
| **Product Manager** | Analyze user data, track KPIs visually |
| **Marketing Team** | Understand campaign data without Excel skills |
| **HR Manager** | Analyze employee data, attrition trends |
| **Teacher / Principal** | Track student performance across batches |
| **Startup Founder** | Quick insights from sales/user data |
| **Data Scientist** | Rapid EDA (Exploratory Data Analysis) |
| **Student** | Learn data analysis without coding |

### Developer Skills Demonstrated

This project proves competency in:

- ✅ **Frontend Development** — React, Tailwind, Recharts, component architecture
- ✅ **Backend Development** — Node.js, Express, REST APIs, file handling
- ✅ **AI Integration** — Prompt engineering, structured AI outputs, LLM APIs
- ✅ **Data Processing** — CSV parsing, column type detection, aggregation
- ✅ **System Design** — Multi-layer architecture, state management, session handling
- ✅ **UI/UX Design** — Dark theme, animations, responsive layout
- ✅ **Deployment** — Vercel (frontend) + Render (backend)

---

## 🛠️ Tech Stack & Rationale

### Why These Technologies?

| Layer | Technology | Why Chosen |
|-------|-----------|------------|
| **Frontend** | React 18 | Component reusability, large ecosystem, industry standard |
| **Build Tool** | Vite | 10x faster than CRA, instant HMR (Hot Module Reload) |
| **Styling** | Tailwind CSS | Utility-first, no CSS file bloat, consistent design system |
| **Charts** | Recharts | React-native, responsive, highly customizable, free |
| **Icons** | Lucide React | Consistent, lightweight, tree-shakeable |
| **HTTP Client** | Axios | Better error handling than fetch, interceptors support |
| **Backend** | Node.js + Express | Same language as frontend, fast I/O, huge npm ecosystem |
| **AI Model** | Groq (LLaMA 3.3) | Free tier, fastest inference speed (<1s), no credit card |
| **CSV Parser** | PapaParse | Most popular JS CSV library, handles edge cases well |
| **File Upload** | Multer | De-facto standard for Express file handling |
| **Fonts** | Syne + DM Sans | Professional, modern, great readability |
| **Deployment** | Vercel + Render | Free tiers, GitHub integration, automatic deploys |

### Architecture Decision: Why Separate Frontend & Backend?

```
❌ Single server approach (Next.js):
   - Harder to scale independently
   - AI processing blocks UI
   - Less flexible deployment

✅ Separated approach (React + Express):
   - Frontend and backend scale independently
   - Better separation of concerns
   - API can be reused for mobile apps later
   - Standard industry pattern
```

---

## 🔧 Technologies Explained

### 1. ⚛️ React 18
**What it is:** A JavaScript library for building user interfaces using reusable components.

**How we use it:** Every UI piece (ChatPanel, ChartRenderer, SummaryCard) is a React component. State management handles upload sessions, chat messages, and dashboard tabs.

```jsx
// Example: How components pass data down
<DashboardPage session={session} onReset={handleReset} />
    └── <StatsOverview session={session} />
    └── <ChatPanel session={session} messages={msgs} />
    └── <DataPreview session={session} />
```

---

### 2. ⚡ Vite
**What it is:** Next-generation frontend build tool that replaces Create React App.

**How we use it:** Runs the development server with instant hot reload and builds the production bundle. Also handles the API proxy — forwarding `/api` requests to our Express backend during development.

```js
// vite.config.js — proxy setup
server: {
  proxy: {
    "/api": { target: "http://localhost:5000" }
  }
}
```

---

### 3. 🎨 Tailwind CSS
**What it is:** Utility-first CSS framework — instead of writing CSS files, you apply pre-built classes directly in HTML/JSX.

**How we use it:** Layout, spacing, and responsive design. We also use custom CSS variables alongside Tailwind for our design tokens (colors, borders, shadows).

---

### 4. 📈 Recharts
**What it is:** A composable charting library built on React components and D3.

**How we use it:** Our `ChartRenderer.jsx` component accepts `data`, `chartType`, `xKey`, `yKey` props and renders the appropriate chart. Supports Bar, Line, Area, and Pie charts with custom tooltips.

```jsx
// ChartRenderer decides which chart to show
if (chartType === "pie")  return <PieChart ... />
if (chartType === "line") return <LineChart ... />
if (chartType === "area") return <AreaChart ... />
return <BarChart ... /> // default
```

---

### 5. 🟢 Node.js + Express
**What it is:** Node.js is a JavaScript runtime for servers. Express is a minimal web framework on top of it.

**How we use it:** Our backend handles three main jobs:
- `/api/upload` — Receives CSV, parses it, stores in memory
- `/api/insights` — Sends user query + dataset stats to Groq AI
- `/api/analyze` — Runs data operations (groupBy, topN, etc.) on the stored data
- `/api/summary` — Generates AI summary of the entire dataset

---

### 6. 🤖 Groq AI (LLaMA 3.3-70b)
**What it is:** Groq is an AI inference platform. LLaMA 3.3 is Meta's open-source large language model.

**How we use it:** We send a detailed prompt containing:
- Column names and types
- Pre-computed statistics (counts, frequencies, sums) from ALL rows
- The user's question

Groq returns a structured JSON response telling us either:
- A **text answer** — *"There are 12 students who failed"*
- A **chart operation** — `{ type: "count_by", column: "Result" }`

```js
// Groq decides what to return
{
  "responseType": "text",        // OR "chart"
  "answer": "12 students failed",
  "followUp": "Would you like to see which courses had failures?"
}
```

---

### 7. 📄 PapaParse
**What it is:** The most widely used CSV parsing library for JavaScript.

**How we use it:** Converts raw CSV text into a JavaScript array of objects, with automatic type detection (numbers vs strings), header parsing, and empty line skipping.

```js
// PapaParse output example
[
  { Name: "Aarav", Course: "BTech", Year: 2023, Result: "Pass" },
  { Name: "Riya",  Course: "BCA",   Year: 2024, Result: "Fail" },
  ...
]
```

---

### 8. 📦 Multer
**What it is:** Node.js middleware for handling file uploads (multipart/form-data).

**How we use it:** Receives the CSV file from the frontend, validates it's actually a CSV, limits size to 10MB, and saves it temporarily so we can read and parse it.

---

### 9. 🔄 Axios
**What it is:** A promise-based HTTP client for making API requests.

**How we use it:** All frontend API calls go through our `api.js` utility which wraps Axios. In production it calls the Render backend URL. In development it calls localhost:5000.

---

## 🔀 Architecture & Flowcharts

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER BROWSER                        │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ UploadPage  │  │DashboardPage │  │  ChatPanel    │  │
│  │ (React)     │  │ (React)      │  │  (React)      │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                │                   │          │
│         └────────────────┼───────────────────┘          │
│                          │  Axios HTTP calls            │
└──────────────────────────┼──────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   VERCEL    │
                    │  (Frontend) │
                    └──────┬──────┘
                           │ HTTPS
                    ┌──────▼──────────────────────────────┐
                    │         RENDER (Backend)            │
                    │  ┌─────────────────────────────┐   │
                    │  │      Express.js Server       │   │
                    │  │                             │   │
                    │  │  /api/upload  → PapaParse   │   │
                    │  │  /api/analyze → Data Ops    │   │
                    │  │  /api/insights → Groq AI    │   │
                    │  │  /api/summary  → Groq AI    │   │
                    │  └──────────────┬──────────────┘   │
                    │                 │                   │
                    │  ┌──────────────▼──────────────┐   │
                    │  │     In-Memory Session Store  │   │
                    │  │  { data, columns, stats }    │   │
                    │  └─────────────────────────────┘   │
                    └─────────────────┬───────────────────┘
                                      │ HTTPS API call
                              ┌───────▼───────┐
                              │   GROQ API    │
                              │ LLaMA 3.3-70b │
                              └───────────────┘
```

---

### CSV Upload Flow

```
User selects CSV file
        │
        ▼
Frontend validates
  • Is it .csv?          NO → Show error message
  • Is it under 10MB?    NO → Show error message
        │ YES
        ▼
Axios POST /api/upload
(multipart/form-data)
        │
        ▼
Multer receives file
        │
        ▼
PapaParse reads CSV
  • Extract column names
  • Detect types (string/numeric/year/date)
  • Parse all rows
        │
        ▼
Calculate statistics
  • For string cols → count unique values + frequency
  • For numeric cols → sum, avg, min, max, median
  • For year cols → count per year
        │
        ▼
Store in session memory
{ sessionId, data, columns, columnTypes, stats }
        │
        ▼
Return to frontend
{ sessionId, columns, stats, preview(5 rows) }
        │
        ▼
Frontend shows Dashboard
```

---

### AI Chat Query Flow

```
User types question
"how many students failed?"
        │
        ▼
POST /api/insights
{ sessionId, query }
        │
        ▼
Backend builds prompt:
  • Column names + types
  • Full dataset stats (ALL rows)
  • Value counts for every column
  • User's question
        │
        ▼
Send to Groq API
(LLaMA 3.3-70b-versatile)
        │
        ▼
Groq decides response type:
        │
   ┌────┴────┐
   │         │
"text"    "chart"
   │         │
   ▼         ▼
Return    POST /api/analyze
answer    { sessionId, operation }
"12 fail"      │
   │           ▼
   │      Run operation on data:
   │      • count_by "Result"
   │      • group_by course + metric
   │      • top_n, distribution, etc.
   │           │
   │           ▼
   │      Return { result[], xKey, yKey }
   │           │
   └─────┬─────┘
         │
         ▼
Frontend renders:
  • Text answer OR
  • ChartRenderer with data
  + Insight card
  + Follow-up suggestion
```

---

### Component Tree

```
App.jsx
├── UploadPage.jsx          (when no session)
│   ├── Drag & Drop Zone
│   ├── File Validation
│   └── Progress Bar
│
└── DashboardPage.jsx       (when session exists)
    ├── Sidebar
    │   ├── Navigation (Overview / AI Chat / Data Preview)
    │   ├── Column Types display
    │   └── New File / Exit buttons
    │
    ├── Header Bar
    │   ├── Page title
    │   ├── File badge
    │   └── Row/column count
    │
    └── Main Content (switches by active tab)
        ├── StatsOverview.jsx
        │   ├── SummaryCard.jsx      ← AI-generated paragraph
        │   ├── ChartCard (Bar)      ← Auto chart 1
        │   ├── ChartCard (Pie)      ← Auto chart 2
        │   ├── ChartCard (Line)     ← Auto chart 3
        │   ├── CollapsibleSection   ← Numeric stats
        │   └── CollapsibleSection   ← All columns
        │
        ├── ChatPanel.jsx
        │   ├── Message bubbles (user + AI)
        │   ├── ChartRenderer.jsx    ← Inside AI responses
        │   ├── Suggestion chips
        │   ├── Typing indicator
        │   └── Input bar
        │
        └── DataPreview.jsx
            └── Full data table
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📤 **Drag & Drop Upload** | Upload CSV by dragging or clicking, with validation and progress bar |
| 🤖 **AI Dataset Summary** | Auto-generated paragraph describing your data on upload |
| 🔑 **Key Findings** | 3 AI-identified insights, hidden behind "Show More" |
| 📊 **Auto Bar Chart** | Automatically generated from most meaningful columns |
| 🥧 **Auto Pie Chart** | Distribution chart from categorical data |
| 📈 **Auto Line Chart** | Trend over time using year column |
| 💬 **AI Chat** | Ask any question in plain English |
| 🔢 **Exact Counts** | AI reads ALL rows, not just a sample |
| 📋 **Data Preview** | View first 5 rows of your CSV in a clean table |
| 🔽 **Collapsible Sections** | Numeric summary and column list hidden by default |
| 💾 **Session Persistence** | Dashboard survives page refresh |
| 🕒 **Chat History** | Chat messages preserved when switching tabs |
| 📱 **Mobile Responsive** | Hamburger menu and responsive layout |
| 🎨 **Dark Theme** | Professional dark UI throughout |
| ⚡ **Fast AI** | Groq's LLaMA gives sub-second responses |

---

## 🚀 Getting Started

### Prerequisites

```bash
node -v    # v18 or higher required
npm -v     # v8 or higher
```

You also need a free **Groq API key** from [https://console.groq.com](https://console.groq.com)

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/SaharshPatel2112/ai-data-analyst.git
cd ai-data-analyst
```

**2. Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Add your Groq API key to .env
```

Your `backend/.env` file:
```
PORT=5000
GEMINI_API_KEY=your_groq_api_key_here
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
```

---

### Running Locally

Open **two terminals** side by side:

**Terminal 1 — Backend**
```bash
cd backend
node server.js
# ✅ Server running on http://localhost:5000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
# ➜ Local: http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | `https://your-app.vercel.app` |
| Backend | Render | `https://your-backend.onrender.com` |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.

---

## 📁 Project Structure

```
ai-data-analyst/
│
├── frontend/                     ← React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPanel.jsx     ← AI chat interface
│   │   │   ├── ChartRenderer.jsx ← All chart types (bar/line/pie/area)
│   │   │   ├── DataPreview.jsx   ← CSV data table
│   │   │   ├── StatsOverview.jsx ← Dashboard overview with auto charts
│   │   │   └── SummaryCard.jsx   ← AI-generated dataset summary
│   │   │
│   │   ├── pages/
│   │   │   ├── UploadPage.jsx    ← Landing page with drag & drop
│   │   │   └── DashboardPage.jsx ← Main dashboard layout + sidebar
│   │   │
│   │   ├── styles/
│   │   │   ├── index.css         ← CSS variables + global reset
│   │   │   ├── dashboard.css     ← Sidebar, header, layout
│   │   │   ├── upload.css        ← Upload zone styles
│   │   │   ├── chat.css          ← Chat bubbles, input
│   │   │   └── components.css    ← Buttons, badges, cards, animations
│   │   │
│   │   ├── utils/
│   │   │   ├── api.js            ← All backend API calls (Axios)
│   │   │   └── helpers.js        ← Format numbers, colors, labels
│   │   │
│   │   ├── App.jsx               ← Root component + session management
│   │   └── main.jsx              ← React entry point
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json               ← Vercel deployment config
│
├── backend/                      ← Node.js + Express API
│   ├── routes/
│   │   ├── upload.js             ← POST /api/upload
│   │   ├── analyze.js            ← POST /api/analyze
│   │   ├── insights.js           ← POST /api/insights (Groq AI)
│   │   └── summary.js            ← POST /api/summary (Groq AI)
│   │
│   ├── middleware/
│   │   └── multer.js             ← File upload config
│   │
│   ├── utils/
│   │   └── csvParser.js          ← Parse CSV, detect types, calc stats
│   │
│   ├── uploads/                  ← Temporary file storage
│   ├── server.js                 ← Express app entry point
│   ├── .env.example              ← Environment variable template
│   └── render.yaml               ← Render deployment config
│
└── README.md
```

---

## 🔚 Conclusion

The **AI Data Analyst Dashboard** demonstrates how modern web technologies and AI can work together to solve a real-world problem — making data analysis accessible to everyone.

### What This Project Proves

**Technically:**
- Ability to build a complete full-stack application from scratch
- Integration of third-party AI APIs with structured prompt engineering
- Real-time data processing and dynamic visualization
- Clean component architecture with proper state management
- Production deployment with environment-based configuration

**Practically:**
- A non-technical user can get meaningful insights from any CSV file in under 30 seconds
- The conversational AI interface removes the barrier of knowing tools like SQL, Python, or Excel
- The auto-generated charts give immediate value without any user configuration

### Future Enhancements

- [ ] 🔐 JWT Authentication — multi-user support
- [ ] 💾 Database Integration — save and share dashboards
- [ ] 📤 Export Features — download charts as PNG, data as Excel
- [ ] 🔄 Multiple File Support — compare two CSV files
- [ ] 🎯 Advanced AI — custom ML model training on user's data
- [ ] 📱 Mobile App — React Native version
- [ ] 🌐 Multi-language Support — analyze data in any language

### Final Rating

| Category | Score |
|----------|-------|
| Technical Complexity | ⭐⭐⭐⭐⭐ |
| Real-world Usefulness | ⭐⭐⭐⭐⭐ |
| UI/UX Quality | ⭐⭐⭐⭐☆ |
| AI Integration Depth | ⭐⭐⭐⭐⭐ |
| Portfolio Value | ⭐⭐⭐⭐⭐ |
| **Overall** | **9/10** |

---

<div align="center">

**Built with ❤️ using React, Node.js, and Groq AI**

[⬆ Back to Top](#-ai-data-analyst-dashboard)

</div>
