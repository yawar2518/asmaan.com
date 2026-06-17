# Asmaan.com 🛰️

### Pakistan's first satellite-first, AI-powered, verified real estate marketplace.

> *"Har Pata Apko Pata Hai"*

[![Django](https://img.shields.io/badge/Django-5.0-green)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://postgresql.org)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.6-green)](https://postgis.net)
[![Mapbox](https://img.shields.io/badge/Mapbox-GL%20JS-black)](https://mapbox.com)

---

## What is Asmaan?

Pakistan's real estate market suffers from stale listings, unverified agents, and zero transparency. Asmaan.com solves this by combining:

- 🛰️ **Satellite-first map interface** — every property pinned on real aerial imagery of Pakistani cities
- ✅ **Physical verification workflow** — every listing is visited, photographed, and admin-approved before going live
- 🤖 **AI neighbourhood intelligence** — amenity scoring, smart recommendations, and property valuation
- 🌍 **Built for overseas Pakistanis** — trusted listings with GPS precision for remote buyers

---

## Project Structure

```
asmaan.com/
├── asmaan-backend/        # Django 5 + DRF + PostGIS
│   ├── apps/
│   │   ├── properties/    # Property model, API, admin
│   │   └── listings/      # Seller listing requests + workflow
│   ├── asmaan/            # Django settings, root URLs
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── asmaan-frontend/       # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Reusable UI (Navbar, Map, Cards)
│   │   ├── pages/         # Buy, Rent, Plots pages
│   │   ├── hooks/         # useProperties and future hooks
│   │   └── services/      # Centralised API calls (axios)
│   ├── package.json
│   └── .env.example
│
└── docs/
    ├── SPRINT_1_GUIDE.md  # Full Sprint 1 developer handoff
    └── instructions.md    # Master project instructions
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12 · Django 5 · Django REST Framework |
| Frontend | React 18 · Vite · Tailwind CSS |
| Database | PostgreSQL 16 · PostGIS 3.6 |
| Map | Mapbox GL JS (satellite-streets style) |
| Spatial | GDAL 3.8.4 · GeoDjango · PointField |
| ML / AI | scikit-learn · XGBoost · pandas · cosine similarity |
| Storage | Cloudinary (property images) |
| External APIs | Google Places API · Mapbox |
| Cloud | Google Cloud Platform (Cloud Run + Cloud SQL) |
| Dev tools | python-decouple · django-cors-headers · axios |

---

## Quick Start

> ⚠️ **Python 3.12 is required.** Python 3.13/3.14 are not compatible with GDAL on Windows.
> See `docs/SPRINT_1_GUIDE.md` for the full setup guide including PostGIS and GDAL wheel installation.

### Backend

```powershell
cd asmaan-backend

# Create venv with Python 3.12 specifically
py -3.12 -m venv venv
venv\Scripts\activate

# Install GDAL wheel first (Windows only)
pip install GDAL-3.8.4-cp312-cp312-win_amd64.whl

# Install remaining dependencies
pip install -r requirements.txt

# Set up environment variables
copy .env.example .env   # then fill in your values

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

Admin panel → `http://127.0.0.1:8000/admin/`
API root → `http://127.0.0.1:8000/api/`

### Frontend

```powershell
cd asmaan-frontend
npm install

# Add your Mapbox token to .env
# VITE_MAPBOX_TOKEN=pk.your_token_here

npm run dev
```

App → `http://localhost:5173/buy`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/properties/` | List all available properties |
| GET | `/api/properties/?category=buy` | Filter by category (buy / rent / plot) |
| GET | `/api/properties/?search=DHA` | Full-text search |
| GET | `/api/properties/?ordering=-price` | Order by price descending |
| GET | `/api/properties/{id}/` | Get single property detail |

---

## Environment Variables

### Backend (`asmaan-backend/.env`)

```ini
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=asmaan_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

GOOGLE_PLACES_API_KEY=your-key
```

### Frontend (`asmaan-frontend/.env`)

```ini
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

Never commit `.env` files — they are in `.gitignore`.

---

## Sprint Progress

| Sprint | Status | Deliverable |
|---|---|---|
| Sprint 1 | ✅ Complete | Repo setup · Django models · PostGIS · REST API · React + Mapbox · Split-panel UI |
| Sprint 2 | 🔄 In progress | Property detail · Seller form · Agent workflow · Cloudinary images |
| Sprint 3 | ⏳ Planned | JWT auth · Neighbourhood AI · ML scoring model |
| Sprint 4–6 | ⏳ Planned | Recommendations · Overseas portal · GCP deployment |

---

## Team

| Name | Role |
|---|---|
| Yawar Abbas | Frontend Lead + ML Lead |
| Syeda Misha Shah | Frontend + ML Support |
| Urwa Abbas Ahsan | Backend Lead |

**Supervisor:** Muhammad Nabeel
**Co-supervisor:** Dr. Muhammad Ahsan
**Institution:** University of Management and Technology (UMT), School of Systems and Technology

---

## Documentation

- `docs/SPRINT_1_GUIDE.md` — complete Sprint 1 developer handoff with code explanations and troubleshooting
- `docs/instructions.md` — master project instructions, architecture, and conventions

---

*Asmaan (آسمان) means sky in Urdu — a nod to the satellite view that defines the platform.*