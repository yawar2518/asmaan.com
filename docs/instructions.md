# Asmaan.com — Master Project Instructions

## 1. Project Identity & Core Concept

**Asmaan.com is Pakistan's first map-first, AI-enriched, managed property platform**^^. **It is designed to address the lack of transparency, stale listings, and agent fraud prevalent in the local real estate market**^^.

* **Verified Workflow:** Every listing is physically visited by the team, professionally photographed, and approved by an administrator before going live^^^^^^^^.
* **Map-First Interface:** The primary interface is a satellite map powered by Mapbox GL JS, displaying price-label pins over real aerial imagery of Pakistani citiy^^^^^^^^^^^^^^^^^^.
* **Revenue Model:** The platform operates on a commission-on-success model, earning 1-2% from buyers and sellers only when a deal successfully closes^^^^^^^^.
* **Target Audience:** Primary users include property buyers, sellers, and students relocating, while secondary users include overseas Pakistani investors and real estate developers^^.

---

## 2. Team Structure & Roles

**The project is supervised by Muhammad Nabeel and co-supervised by Dr. Muhammad Ahsan**^^^^^^^^^^^^^^^^^^. Based on the latest project timeline updates, the development responsibilities are distributed as follows:

| **Team Member** | **Primary Role**  | **Secondary Responsibilities**                                      |
| --------------------- | ----------------------- | ------------------------------------------------------------------------- |
| **Yawar Abbas** | Frontend Lead + ML Lead | **Backend Support, JIRA management, documentation**.                |
| **Urwa Abbas**  | Backend Lead            | Core backend logic, database modeling, cloud deployment.                  |
| **Misha Shah**  | Frontend + ML Support   | **UI components, AI module integration assistance, data curation**. |

---

## 3. System Architecture & Tech Stack

**The system follows a decoupled architecture where a Django REST Framework API serves JSON data to a React frontend**^^.

| **Layer**         | **Technology**                  | **Purpose**                                                  |
| ----------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| **Backend**       | Python Django (5.x)                   | **REST API, admin panel, business logic**.                   |
| **Frontend**      | React.js (18.x) & Tailwind CSS (3.x)  | **Component-based UI and utility-first styling**.            |
| **Database**      | PostgreSQL 16 + PostGIS (3.x)         | **Primary data store with geospatial radius queries**.       |
| **Map Interface** | Mapbox GL JS (3.x)                    | **Satellite tiles, price-label pins**.                       |
| **AI / ML**       | scikit-learn (1.5.0), Pandas, XGBoost | **Training and executing machine learning models**.          |
| **Cloud Hosting** | Google Cloud Platform & Vercel        | Cloud Run and Cloud SQL for backend;**Vercel for frontend**. |

---

## 4. Basic Project Setup Guide

Follow these instructions to get the local development environment running.

> ⚠️ **Critical:** Python 3.12 is required. Python 3.13 and 3.14 are NOT compatible
> with GDAL/PostGIS on Windows. Do not skip this.

### Prerequisites — Install these first (in order)

1. **Python 3.12** via winget:
```powershell
   winget install Python.Python.3.12
```

2. **Node.js LTS** via winget:
```powershell
   winget install OpenJS.NodeJS.LTS
```

3. **PostgreSQL 16** via winget:
```powershell
   winget install PostgreSQL.PostgreSQL.16
```
   Then add to PATH permanently:
```powershell
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\PostgreSQL\16\bin", "User")
```
   Close and reopen PowerShell after this.

4. **PostGIS 3.6** — download the installer from:
   `https://download.osgeo.org/postgis/windows/pg16/`
   Pick: `postgis-bundle-pg16x64-setup-3.6.x-x.exe`
   During install:
   - Username: `postgres` | Password: `postgres` | Port: `5432`
   - ✅ Tick "Create spatial database" → name it `asmaan_db`

---

### Backend (Django) Setup

1. Clone the repo and switch to `dev`:
```powershell
   git clone https://github.com/yawar2518/asmaan.com.git
   cd asmaan.com
   git checkout dev
```

2. Navigate to the backend and create a Python 3.12 virtual environment:
```powershell
   cd asmaan-backend
   py -3.12 -m venv venv
   venv\Scripts\activate
```

3. **Install GDAL wheel manually first** (cannot be installed via pip on Windows):
   Download this file into `asmaan-backend/`:
   `https://github.com/cgohlke/geospatial-wheels/releases/download/v2024.2.18/GDAL-3.8.4-cp312-cp312-win_amd64.whl`
   Then install it:
```powershell
   pip install GDAL-3.8.4-cp312-cp312-win_amd64.whl
```

4. Install all remaining dependencies:
```powershell
   pip install -r requirements.txt
```

5. Create your `.env` file by copying `.env.example`:
```powershell
   copy .env.example .env
```
   Open `.env` and fill in:
```ini
   SECRET_KEY=django-insecure-change-this-later
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   DB_NAME=asmaan_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
```

6. Run migrations:
```powershell
   python manage.py migrate
```

7. Create your admin account:
```powershell
   python manage.py createsuperuser
```

8. Start the backend:
```powershell
   python manage.py runserver
```
   Admin panel: `http://127.0.0.1:8000/admin/`

---

### Frontend (React) Setup

Open a **second terminal** — keep the backend running in the first.

1. Navigate to the frontend:
```powershell
   cd asmaan-frontend
```

2. Install Node packages:
```powershell
   npm install
```

3. Create a `.env` file in `asmaan-frontend/`:
```ini
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
```
   Get a free token from `https://mapbox.com` → Account → Tokens.
   Each developer should create their own free account (50K map loads/month free).

4. Start the frontend:
```powershell
   npm run dev
```
   Open: `http://localhost:5173/buy`

## 5. AI Modules Specification

**Artificial Intelligence is deeply integrated into the platform across three core modules**^^.

* **Neighbourhood Intelligence (NLP):** This module queries the Google Places API using property GPS coordinates to identify nearby amenities^^. **It applies Natural Language Processing to categorize places into schools, hospitals, mosques, restaurants, and markets, caching the results to avoid repeat billing**^^.
* **Composite Neighbourhood Scoring (Machine Learning):** This supervised learning module uses a Random Forest or XGBoost Regression model to calculate a desirability score between 0 and 10^^^^^^^^. **It is trained on 30 manually labeled areas in Lahore and evaluates amenity density, ISP availability, and infrastructure**^^. **The trained model is serialized as **`<span class="citation-492">model.pkl</span>` and loaded into Django at startup^^.
* **Smart Property Recommendation:** A content-based filtering engine that suggests the top 5 alternative properties to a user^^^^^^^^. **It encodes property features (price, size, beds, zone, and neighborhood score) into a numerical feature vector and computes Cosine Similarity using scikit-learn**^^.

---

## 6. Development & Git Workflow Rules

**Maintaining an organized codebase requires strict adherence to these conventions**^^.

* **Branching Strategy:** * The `<span class="citation-488">main</span>` branch is strictly for production; code must never be committed directly here^^.
  * **The **`<span class="citation-487">dev</span>` branch is the integration branch where all features merge first^^.
  * **Feature branches must branch off **`<span class="citation-486">dev</span>` and follow the exact format: `<span class="citation-486">feature/ASM-{id}-name</span>` (e.g., `<span class="citation-486">feature/ASM-13-mapbox-satellite-map</span>`)^^.
* **Commit Messages:** Every commit must begin with the corresponding JIRA ticket ID followed by a brief description (e.g., `<span class="citation-485">ASM-11: Add Property model with PostGIS PointField</span>`)^^.
* **React Conventions:** Use functional components exclusively, destructure props in the function signature, and route all API calls through the `<span class="citation-484">src/services/api.js</span>` file rather than fetching directly inside components^^.
* **Backend Conventions:** Cache all Google Places API responses per property to minimize costs, and use GeoDjango `<span class="citation-483">PointField</span>` for all GPS coordinates instead of separate float fields^^.

---

## 6.5 Git Commands Reference

### Daily workflow

```powershell
# Always start by pulling latest changes
git checkout dev
git pull origin dev

# Check what files you changed
git status

# Stage your changes
git add .

# Commit with JIRA ticket ID
git commit -m "ASM-{id}: Brief description of what this commit does"

# Push to dev
git push origin dev
```

### Useful git commands

```powershell
# See commit history
git log --oneline

# Undo unstaged changes to a file
git checkout -- filename.jsx

# See exactly what changed in a file
git diff filename.jsx

# Pull latest before starting any new task
git pull origin dev
```

### Rules — never break these

| Rule | Why |
|---|---|
| Never push directly to `main` | `main` is production — only merged PRs go here |
| Always include JIRA ID in commit message | Links code to ticket; JIRA auto-tracks progress |
| Never commit `.env` files | Contains real passwords — in `.gitignore` for a reason |
| Never commit `venv/` or `node_modules/` | Huge folders; each developer installs their own |
| Always `git pull` before starting work | Avoids merge conflicts with teammates |

## 7. Master Timeline & Roadmap

**The project execution spans 14 sprints divided into two major phases**^^.

* **FYP-I (Sprints 1-6 | Apr – Jul 2025):** The focus is on the core platform foundation^^. **This includes setting up the Django/React architecture, integrating the Mapbox satellite map, building the property models, and establishing the administrative review workflow**^^^^^^^^.
* **Break Sprint (Sprint 7 | Aug – Sep 2025):** A dedicated period for ML research, manually mapping static ISP and load-shedding JSON data for Lahore, and labeling the 30 Lahore areas for ground-truth desirability^^^^^^^^.
* **FYP-II (Sprints 8-14 | Oct 2025 – Jan 2026):** The focus shifts to building and testing the AI modules (NLP, ML Scoring, and Recommendations), executing the GCP deployment, seeding 20 real Lahore listings, and finalizing documentation for the project defense^^^^^^^^^^^^^^^^^^.
