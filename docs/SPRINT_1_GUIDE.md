# Sprint 1 — Developer Handoff Guide

**Project:** Asmaan.com — Pakistan's first satellite-first, AI-powered, verified real estate marketplace
**Sprint:** 1 of 4 (FYP-I)
**Author:** Yawar Abbas
**For:** Syeda Misha Shah, Urwa Abbas Ahsan, Muhammad Nabeel (Supervisor / Product Owner), Dr. Muhammad Ahsan (Co-supervisor)

---

## 1. Purpose of this document

This document is the **complete walkthrough** of everything built in Sprint 1. By the end of reading it you should be able to:

1. Understand the system architecture — how backend and frontend talk to each other
2. Set up the project on your own laptop from a fresh clone
3. Understand what every file in the codebase does
4. Continue Sprint 2 development without needing to re-learn the basics

Read this once end-to-end, then keep it open as a reference while setting up.

---

## 2. What was built in Sprint 1

Sprint 1 delivered the **foundation** of the platform. We did not build features for end users yet — we built the skeleton on which all future sprints will add features.

By the end of Sprint 1, the following works end-to-end:

- A Django backend with PostgreSQL + PostGIS storing real estate properties with GPS coordinates
- A Django admin panel where the admin can add properties through a web form with a map widget
- A REST API endpoint that returns properties filtered by category (Buy / Rent / Plot)
- A React frontend showing a satellite map of Lahore
- Three category pages (`/buy`, `/rent`, `/plots`) each fetching only their own properties
- A split-panel layout — scrollable property cards on the left, satellite map with price pins on the right
- Click a pin → mini popup with property details
- Verified properties get a green "✓ Verified" badge
- Top navigation bar with Buy / Rent / Plots links

**Total tasks completed:** 32 across 5 phases.

---

## 3. System architecture

This is the most important diagram in this document. Understand this before anything else.

```
┌─────────────────────────────────────────────────────────────┐
│                         YOUR BROWSER                         │
│                                                              │
│  React Frontend (Vite dev server, port 5173)                │
│  ──────────────────────────────────────────────             │
│   • Satellite map (Mapbox GL JS)                            │
│   • Property cards                                          │
│   • Navigation                                              │
│                                                              │
│                          │                                   │
│                          │ HTTP requests (axios)             │
│                          │ GET /api/properties/?category=buy │
│                          ▼                                   │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                          ▼                                   │
│  Django Backend (port 8000)                                 │
│  ──────────────────────────────────────────────             │
│   • REST API endpoints (Django REST Framework)              │
│   • Django admin panel                                      │
│   • Business logic                                          │
│                                                              │
│                          │                                   │
│                          │ SQL queries (psycopg2)            │
│                          ▼                                   │
│  PostgreSQL 16 + PostGIS 3.6 (port 5432)                   │
│  ──────────────────────────────────────────────             │
│   • Properties table (with PostGIS PointField)              │
│   • ListingRequests table                                   │
│   • PropertyImages, PriceHistory tables                     │
└─────────────────────────────────────────────────────────────┘
```

**Key idea:** the frontend never talks to the database directly. The frontend talks to the backend (via HTTP). The backend talks to the database (via SQL). This separation is what makes the system scalable and secure.

**Why three layers and not one big app?**
- Frontend can be deployed independently (e.g., to a CDN)
- Backend can be scaled separately
- Multiple frontends (web, mobile) can share the same backend later
- Security: database credentials never reach the user's browser

---

## 4. Tech stack — and why each was chosen

| Layer | Technology | Why this and not something else |
|---|---|---|
| Frontend framework | React 18 + Vite | React is industry standard. Vite is much faster than Create React App. |
| Frontend styling | Tailwind CSS | Faster than writing CSS files; consistent design system. |
| Map library | Mapbox GL JS | Best satellite imagery in Pakistan; free 50K loads/month. |
| HTTP client | Axios | Cleaner than `fetch` for handling errors and headers. |
| Frontend routing | React Router | Standard for SPAs. |
| Backend framework | Django 5 | Mature, admin panel free, ORM is excellent. |
| Backend API | Django REST Framework (DRF) | Standard for Django APIs; saves weeks of boilerplate. |
| Database | PostgreSQL 16 | Production-grade open-source DB. Required for PostGIS. |
| Spatial extension | PostGIS 3.6 | Lets us store GPS as a real spatial type, not just lat/lng numbers. Enables fast "find properties within 5km" queries later. |
| Spatial Python lib | GDAL 3.8.4 | C library Django uses to talk to PostGIS. |
| Env management | python-decouple | Keeps secrets out of `settings.py` and out of Git. |
| CORS handling | django-cors-headers | Allows React (port 5173) to call Django (port 8000) — different ports = cross-origin. |

---

## 5. Setting up the project on a new laptop (step-by-step)

Follow this **exactly in order**. Skipping a step will cause errors that are hard to debug.

### 5.1 Install Python 3.12

**Important:** Python 3.13 or 3.14 will **not work** — GDAL has no pre-built wheels for them on Windows.

Open PowerShell and run:

```powershell
winget install Python.Python.3.12
```

Verify:

```powershell
py -3.12 --version
```

Should show `Python 3.12.10` or similar.

### 5.2 Install Node.js (for the frontend)

Either via winget:

```powershell
winget install OpenJS.NodeJS.LTS
```

Or download from https://nodejs.org and pick the LTS version.

Verify:

```powershell
node -v
npm -v
```

### 5.3 Install PostgreSQL 16

```powershell
winget install PostgreSQL.PostgreSQL.16
```

Default credentials after install:
- Username: `postgres`
- Password: `postgres`
- Port: `5432`

PostgreSQL's `bin` folder is not added to PATH by winget. Add it permanently:

```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\PostgreSQL\16\bin", "User")
```

**Close PowerShell and open a new one**, then verify:

```powershell
psql --version
```

### 5.4 Install PostGIS 3.6

Download the installer (around 100 MB):

**https://download.osgeo.org/postgis/windows/pg16/**

Pick the file that matches this pattern: `postgis-bundle-pg16x64-setup-3.6.x-x.exe`

During install:
- When prompted for PostgreSQL credentials: username `postgres`, password `postgres`, port `5432`
- Tick **"Create spatial database"**
- Database name: `asmaan_db`
- Keep all other defaults

Verify it worked:

```powershell
psql -U postgres -d asmaan_db
# Password: postgres
asmaan_db=# SELECT PostGIS_Version();
asmaan_db=# \q
```

If `PostGIS_Version()` returns a version string, you're good.

### 5.5 Clone the repository

```powershell
git clone https://github.com/yawar2518/asmaan.com.git
cd asmaan.com
git checkout dev
```

### 5.6 Set up the backend

```powershell
cd asmaan-backend

# Create a virtual environment using Python 3.12 specifically
py -3.12 -m venv venv

# Activate it
venv\Scripts\activate

# You should now see (venv) at the start of your prompt
```

**Install the GDAL wheel manually first.** Download this file (35 MB) into `asmaan-backend/`:

**https://github.com/cgohlke/geospatial-wheels/releases/download/v2024.2.18/GDAL-3.8.4-cp312-cp312-win_amd64.whl**

Then:

```powershell
pip install GDAL-3.8.4-cp312-cp312-win_amd64.whl
```

Now install the rest:

```powershell
pip install -r requirements.txt
```

### 5.7 Set up environment variables

In `asmaan-backend/`, create a file called `.env` (no extension prefix). Use `.env.example` as the template. Fill in real values:

```ini
SECRET_KEY=django-insecure-change-this-later-asmaan-fyp
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=asmaan_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

**`.env` is in `.gitignore` — never commit it.**

### 5.8 Run database migrations

```powershell
python manage.py migrate
```

This creates all the tables Django needs (auth, sessions, properties, listings).

### 5.9 Create a superuser

```powershell
python manage.py createsuperuser
```

Pick any username/password. This is your admin panel login.

### 5.10 Run the backend

```powershell
python manage.py runserver
```

Visit **http://127.0.0.1:8000/admin/** and log in. You should see Properties, Property images, Price histories, Listing requests.

### 5.11 Set up the frontend

Open a **second** PowerShell window (keep backend running in the first one):

```powershell
cd asmaan.com\asmaan-frontend
npm install
```

This downloads about 400 MB of packages into `node_modules/` (do not commit this folder — it's in `.gitignore`).

### 5.12 Frontend environment variable

Create a `.env` file in `asmaan-frontend/`:

```ini
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

Get a free token from https://mapbox.com → Account → Tokens → Default public token.

(Yawar has his own token. For team development each member should sign up for a free Mapbox account — 50K loads/month is plenty.)

### 5.13 Run the frontend

```powershell
npm run dev
```

Visit **http://localhost:5173/buy** — you should see the satellite map of Lahore.

---

## 6. Project structure explained

```
asmaan.com/                          # Repository root
│
├── asmaan-backend/                  # Django project
│   ├── apps/                        # All Django apps live here
│   │   ├── __init__.py              # Makes "apps" a Python package
│   │   ├── properties/              # App: manages the Property model
│   │   │   ├── migrations/          # Auto-generated DB migration files
│   │   │   ├── __init__.py
│   │   │   ├── admin.py             # Admin panel customisation
│   │   │   ├── apps.py              # App configuration
│   │   │   ├── models.py            # Property, PropertyImage, PriceHistory
│   │   │   ├── serializers.py       # Converts model → JSON for API
│   │   │   ├── urls.py              # API routes for /api/properties/
│   │   │   ├── views.py             # API logic
│   │   │   └── tests.py             # (empty for now — Sprint 2)
│   │   └── listings/                # App: manages seller listing submissions
│   │       └── (same structure)
│   ├── asmaan/                      # Django project settings package
│   │   ├── __init__.py
│   │   ├── settings.py              # The big config file
│   │   ├── urls.py                  # Root URL routes
│   │   ├── wsgi.py                  # Production server entrypoint
│   │   └── asgi.py                  # Async server entrypoint (not used yet)
│   ├── venv/                        # Virtual environment — DO NOT commit
│   ├── .env                         # Real secrets — DO NOT commit
│   ├── .env.example                 # Template — commit this
│   ├── manage.py                    # Django CLI entrypoint
│   └── requirements.txt             # Python dependencies
│
├── asmaan-frontend/                 # React project
│   ├── public/                      # Static assets (logos, favicons)
│   ├── src/
│   │   ├── components/              # Reusable UI building blocks
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── VerifiedBadge.jsx
│   │   │   ├── listings/
│   │   │   │   ├── PropertyCard.jsx
│   │   │   │   └── PropertyGrid.jsx
│   │   │   └── map/
│   │   │       └── SatelliteMap.jsx
│   │   ├── hooks/                   # Custom React hooks (reusable logic)
│   │   │   └── useProperties.js
│   │   ├── pages/                   # Full screen components mapped to routes
│   │   │   ├── BuyPage.jsx
│   │   │   ├── RentPage.jsx
│   │   │   └── PlotsPage.jsx
│   │   ├── services/                # All HTTP API calls live here
│   │   │   └── api.js
│   │   ├── App.jsx                  # Root component + routing
│   │   ├── main.jsx                 # React entrypoint
│   │   └── index.css                # Global styles + Tailwind directives
│   ├── node_modules/                # Installed packages — DO NOT commit
│   ├── .env                         # Real Mapbox token — DO NOT commit
│   ├── index.html                   # HTML entrypoint Vite injects React into
│   ├── package.json                 # Node dependencies + scripts
│   ├── vite.config.js               # Vite build config
│   └── tailwind.config.js           # Tailwind config
│
├── .gitignore                       # Files Git should ignore
└── README.md                        # Repo readme
```

**Why pages and components are separate:** A page is a full screen you can route to. A component is a reusable piece a page uses. `PropertyCard` is a component — it's used inside `PropertyGrid`, which is used inside `BuyPage`. `BuyPage` is a page — it owns the route `/buy`.

---

## 7. Phase-by-phase walkthrough

### Phase A — Environment setup (7 tasks: ASM-172 to ASM-178)

This was about getting the foundation in place — repository, dependency lists, environment templates.

**What we did:**
- Created the GitHub repository with `main` and `dev` branches
- Wrote `requirements.txt` listing all Python packages
- Wrote `package.json` listing all Node packages
- Wrote `README.md` for setup instructions
- Created `.env.example` so teammates know what secrets are needed
- Connected JIRA to GitHub so commits auto-link to tickets
- Set up branch protection so nobody pushes directly to `main`

**Key learning:** the `.env.example` pattern. We commit `.env.example` with placeholder values, but `.env` (with real secrets) stays on each developer's machine. This is the standard way to share configuration without leaking passwords.

### Phase B — Django models (8 tasks: ASM-49 to ASM-54, ASM-74, ASM-86)

We designed the database tables. Django's ORM lets us write Python classes, and Django generates the SQL.

#### 7.1 The Property model

File: `asmaan-backend/apps/properties/models.py`

```python
from django.contrib.gis.db import models

class Property(models.Model):
    CATEGORY_CHOICES = [
        ('buy', 'Buy'),
        ('rent', 'Rent'),
        ('plot', 'Plot'),
    ]
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('rented', 'Rented'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')

    price = models.DecimalField(max_digits=12, decimal_places=2)
    size = models.DecimalField(max_digits=8, decimal_places=2, help_text='Size in Marla')
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.IntegerField(null=True, blank=True)
    floors = models.IntegerField(null=True, blank=True)

    area = models.CharField(max_length=100)
    city = models.CharField(max_length=100, default='Lahore')
    address = models.TextField()
    location = models.PointField(help_text='GPS coordinates (longitude, latitude)')

    is_verified = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Why each field:**
- `category` and `status` use `choices` — Django enforces only allowed values at the database level
- `price` uses `DecimalField`, not `FloatField` — floats lose precision for currency
- `location = PointField()` is the magic field — it stores GPS as a real PostGIS point, not two separate lat/lng numbers. This lets us do spatial queries later like "find properties within 5km of this point"
- `auto_now_add=True` sets the timestamp once when row is created. `auto_now=True` updates the timestamp on every save

**Supporting models:**

- `PropertyImage` — multiple images per property (foreign key relationship), with one marked as primary
- `PriceHistory` — tracks price changes over time (useful for the AI valuation model in Sprint 3)

#### 7.2 The ListingRequest model

File: `asmaan-backend/apps/listings/models.py`

This is **different from Property**. When a seller wants to list their property, they submit a `ListingRequest`. An agent visits and verifies it. The admin then approves it and a real `Property` is created.

The `ListingRequest` has fields like `assigned_agent`, `visit_notes`, `admin_notes`, and a `status` field that flows through these stages:

```
pending → agent_assigned → visit_scheduled → visit_completed → under_review → live
                                                                               ↘ rejected
```

This is the workflow that will be implemented in Sprint 2 and Sprint 3.

#### 7.3 Migrations

After writing models we ran:

```powershell
python manage.py makemigrations
python manage.py migrate
```

`makemigrations` looks at the model code and generates SQL migration files. `migrate` applies them to the database. Migration files live in `apps/<app>/migrations/` and **must be committed to Git** — teammates need them to set up their own database.

### Phase C — Django admin + REST API (4 tasks: ASM-107, ASM-108, ASM-109, ASM-55)

#### 7.4 Customising the admin panel

File: `asmaan-backend/apps/properties/admin.py`

Django gives us a free admin panel automatically. But the default is bare-bones. We customised it to:

- Show useful columns in the list view (title, price, area, verified status, date)
- Let the admin filter by category, status, verification
- Let the admin search by title, address, description
- Allow inline editing of `is_verified` and `status` directly from the list
- Show a Google Maps-style widget for the `location` field (provided by `GISModelAdmin`)
- Organise edit form fields into logical groups (Basic Info, Pricing, Location, etc.)

#### 7.5 The REST API endpoint

This is what the React frontend calls.

File: `asmaan-backend/apps/properties/views.py`

```python
from rest_framework import viewsets, filters
from .models import Property
from .serializers import PropertySerializer

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PropertySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'area', 'address', 'description']
    ordering_fields = ['price', 'size', 'created_at']

    def get_queryset(self):
        queryset = Property.objects.filter(status='available')
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset
```

**What's happening:**
- `ReadOnlyModelViewSet` — gives us GET list and GET detail endpoints automatically. No POST/PUT/DELETE (those will come in Sprint 2 when sellers can submit listings)
- `get_queryset()` reads the `?category=buy` query parameter and filters
- `filter_backends` adds free search and ordering — try `?search=DHA` or `?ordering=-price`

File: `asmaan-backend/apps/properties/serializers.py`

The serializer converts a Python `Property` object into a JSON dict. The tricky part is the spatial field — we serialise it as separate `latitude` and `longitude` numbers because PostGIS points are not directly JSON-serialisable:

```python
def get_latitude(self, obj):
    return obj.location.y if obj.location else None

def get_longitude(self, obj):
    return obj.location.x if obj.location else None
```

(In PostGIS, x = longitude and y = latitude. Easy to mix up — be careful.)

File: `asmaan-backend/apps/properties/urls.py`

```python
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')

urlpatterns = [path('', include(router.urls))]
```

`DefaultRouter` automatically generates these URLs from the ViewSet:
- `GET /api/properties/` — list all properties
- `GET /api/properties/<id>/` — get one property

File: `asmaan-backend/asmaan/urls.py` (the root urls file)

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.properties.urls')),
]
```

This wires `/api/properties/` to our ViewSet.

#### 7.6 CORS configuration

Browsers block requests from one origin (port 5173) to another (port 8000) by default. We installed `django-cors-headers` and added in `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
```

This tells the backend: "It's okay if requests come from the React dev server."

### Phase D — React + Mapbox (9 tasks)

#### 7.7 The Vite React project (ASM-11)

`npm create vite@latest` scaffolds a fresh React + Vite project in seconds. Vite gives us:
- Instant hot reload (changes appear in the browser as you save)
- Fast cold start (no Webpack bundling)
- Native ES module support

#### 7.8 The Mapbox satellite map (ASM-12, 13, 23, 24)

File: `asmaan-frontend/src/components/map/SatelliteMap.jsx`

Key concepts:

1. **The container ref:** Mapbox needs a real DOM `<div>` to mount into. React's `useRef` gives us a stable reference to that div.

2. **The map ref:** We store the Mapbox instance in another ref so the `useEffect` only initialises it once.

```jsx
const mapContainer = useRef(null)
const map = useRef(null)

useEffect(() => {
  if (map.current) return  // Don't re-initialise

  map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [74.3587, 31.5204],  // [longitude, latitude] for Lahore
    zoom: 12,
  })
}, [])
```

3. **Coordinates are [lng, lat], NOT [lat, lng].** Mapbox follows the GeoJSON spec which puts longitude first. This is the single most common bug source — always double-check.

4. **Controls:** `NavigationControl` adds zoom buttons, `ScaleControl` adds a distance bar, `GeolocateControl` adds a "find me" button.

#### 7.9 Routing (ASM-42, 43, 44, 45)

File: `asmaan-frontend/src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/buy" />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/rent" element={<RentPage />} />
        <Route path="/plots" element={<PlotsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

`BrowserRouter` enables client-side routing (URL changes don't reload the page). The `Navigate` component redirects `/` to `/buy`.

The `Navbar` component uses `NavLink` (not regular `Link`) so the active route can be styled differently.

### Phase E — Connecting frontend to backend (4 tasks: ASM-27, 46, 56, 57)

This is where everything came together.

#### 7.10 The API service layer (ASM-27)

File: `asmaan-frontend/src/services/api.js`

**Rule:** all HTTP calls live in one file. Never call `axios.get()` directly from a component. This makes it easy to change the backend URL, add auth headers, or handle errors globally.

```jsx
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

export const propertyService = {
  getByCategory: async (category) => {
    const response = await api.get(`/properties/?category=${category}`)
    return response.data.results
  },
}
```

`response.data.results` — Django REST Framework's pagination wraps the array inside a `results` key. We unwrap it here so components get a plain array.

#### 7.11 The custom hook

File: `asmaan-frontend/src/hooks/useProperties.js`

A **custom hook** is just a function whose name starts with `use` and which calls other React hooks (`useState`, `useEffect`). It lets us reuse stateful logic across components.

`useProperties('buy')` returns `{ properties, loading, error }`. The page component doesn't care about axios, URLs, or how to handle race conditions. All that complexity is hidden in the hook.

The `cancelled` flag prevents a stale fetch from overwriting newer data if the user switches pages quickly:

```javascript
let cancelled = false
// ...
if (!cancelled) setProperties(data)
// ...
return () => { cancelled = true }
```

#### 7.12 Map pins (ASM-46)

The `SatelliteMap` now accepts a `properties` prop. A second `useEffect` watches for changes to the array and:
1. Removes all existing markers
2. Creates a new HTML marker for each property at its `[longitude, latitude]`
3. Adds a popup showing title, area, beds/baths/size, verified badge

The price formatting helper converts raw numbers into Pakistan-friendly format:
- 25000000 → "2.5 Cr"
- 500000 → "5.0 Lac"

#### 7.13 Property cards (ASM-56, 57)

`PropertyCard` displays one property. `PropertyGrid` displays many. The page component uses both:

```jsx
<div className="split-layout">
  <PropertyGrid properties={properties} />
  <SatelliteMap properties={properties} />
</div>
```

Both receive the **same data**. This is why the pins and the cards are always in sync — they're rendered from the same source of truth (`useProperties` hook).

This is a core React principle: **lift state up**. The page owns the data. Children only display it.

---

## 8. The full data flow (end-to-end)

This walkthrough traces a single user action from click to screen.

**User action:** opens `http://localhost:5173/buy`

1. Browser loads `index.html`, which loads `main.jsx`, which renders `<App />`
2. React Router matches `/buy` to `<BuyPage />`
3. `BuyPage` calls `useProperties('buy')`
4. Hook calls `propertyService.getByCategory('buy')`
5. Service calls `axios.get('http://127.0.0.1:8000/api/properties/?category=buy')`
6. Browser sends HTTP GET. Django receives it on port 8000
7. Django's URL router matches `/api/properties/` to `PropertyViewSet`
8. DRF calls `get_queryset()` which reads `?category=buy` and filters
9. Django ORM generates SQL: `SELECT * FROM properties_property WHERE status='available' AND category='buy'`
10. PostgreSQL returns rows. Django wraps them as `Property` objects
11. DRF calls `PropertySerializer` on each one. The serializer turns the `location` PointField into `latitude` + `longitude` floats
12. Django returns JSON: `{ "results": [ { id: 1, title: "...", latitude: 31.5, longitude: 74.3, ... } ] }`
13. Axios receives the response. Hook updates state via `setProperties(data)`
14. React re-renders `BuyPage`. The new `properties` array flows down to `<PropertyGrid />` and `<SatelliteMap />`
15. `PropertyGrid` renders one `<PropertyCard />` per property
16. `SatelliteMap` runs its second `useEffect`, removes old markers, creates new ones at the correct coordinates
17. User sees cards on the left, pins on the right. Click a pin → popup. Click verified property → green badge

If any step breaks, that's your debugging trail.

---

## 9. Common problems and fixes (lessons learned)

### 9.1 GDAL won't install on Windows

**Symptom:** `Microsoft Visual C++ 14.0 or greater is required`

**Cause:** pip tries to compile GDAL from C++ source. No compiler installed.

**Fix:** Install the pre-built wheel from cgohlke (Section 5.6 above). The wheel is already compiled.

### 9.2 Django can't find GDAL even after installation

**Symptom:** `Could not find the GDAL library (tried "gdal307", "gdal306", ...)`

**Cause:** Django looks for a versioned DLL name like `gdal307.dll`. The wheel installs it as just `gdal.dll`.

**Fix:** In `settings.py`, point Django directly to the DLL:

```python
GDAL_LIBRARY_PATH = os.path.join(BASE_DIR, 'venv', 'Lib', 'site-packages', 'osgeo', 'gdal.dll')
GEOS_LIBRARY_PATH = os.path.join(BASE_DIR, 'venv', 'Lib', 'site-packages', 'osgeo', 'geos_c.dll')
```

### 9.3 `OGR failure` when saving in admin

**Symptom:** Saving a property with a GPS location fails with `OGR failure`

**Cause:** PROJ data files (used for coordinate transformations) aren't found.

**Fix:** Set `PROJ_LIB` and `GDAL_DATA` env vars in `settings.py`:

```python
os.environ['GDAL_DATA'] = os.path.join(OSGEO_PATH, 'data', 'gdal')
os.environ['PROJ_LIB'] = os.path.join(OSGEO_PATH, 'data', 'proj')
```

**Restart the dev server** — env vars are only read at startup.

### 9.4 CORS error in browser console

**Symptom:** `Access to XMLHttpRequest blocked by CORS policy`

**Cause:** React (5173) and Django (8000) are on different origins.

**Fix:** Install `django-cors-headers`, add it to `INSTALLED_APPS`, add the middleware **at the top** of `MIDDLEWARE`, set `CORS_ALLOWED_ORIGINS`.

### 9.5 `psql: command not found`

**Symptom:** PowerShell can't find `psql`.

**Cause:** PostgreSQL bin folder isn't on PATH.

**Fix:** Section 5.3 above. Add to PATH permanently.

### 9.6 Python version mismatch

**Symptom:** `pip install` succeeds but Django can't find GDAL.

**Cause:** venv was created with Python 3.14, but the GDAL wheel is for Python 3.12 (`cp312`).

**Fix:** Delete the venv. Recreate it with `py -3.12 -m venv venv`.

---

## 10. Running the project (daily workflow)

Every time you sit down to work, you'll need two terminal windows.

**Terminal 1 — Backend:**

```powershell
cd asmaan.com\asmaan-backend
venv\Scripts\activate
python manage.py runserver
```

Leaves Django running on http://127.0.0.1:8000

**Terminal 2 — Frontend:**

```powershell
cd asmaan.com\asmaan-frontend
npm run dev
```

Leaves Vite running on http://localhost:5173

Now visit http://localhost:5173/buy in your browser. Edit any `.jsx` or `.py` file — both servers hot-reload automatically.

---

## 11. Git workflow

Sprint 1 used a simplified workflow because Yawar was the only developer. From Sprint 2 onwards we should follow the proper workflow:

1. Create a feature branch from `dev`:
   ```powershell
   git checkout dev
   git pull origin dev
   git checkout -b feature/ASM-123-description
   ```

2. Work, commit with the JIRA ticket ID in the message:
   ```powershell
   git commit -m "ASM-123: Add property detail page"
   ```

3. Push and open a Pull Request on GitHub: `feature/ASM-123` → `dev`

4. Get a review, merge.

5. At the end of the sprint, merge `dev` → `main` via PR.

Branch protection on `main` and `dev` enforces that you cannot push directly — you must use PRs.

---

## 12. What's next — Sprint 2 preview

Sprint 2 will build on top of what we have:

- **Property detail pages** — clicking a card opens a full view with image gallery
- **Seller listing form** — public form to submit a property for verification
- **Agent assignment** — admin assigns an agent to a `ListingRequest`
- **Visit workflow** — agent updates status as they progress through visit stages
- **Image upload to Cloudinary** — replace dummy image URLs with real uploads
- **Status tracking with unique token** — seller gets a tracking link via email
- **JWT authentication** — admin and agent login (not yet implemented in Sprint 1)

Sprint 2 has 64 tasks across 4 phases. Plan for two weeks of focused work.

---

## 13. Useful commands cheat sheet

### Backend

```powershell
# Activate venv (do this in every new terminal)
venv\Scripts\activate

# Run dev server
python manage.py runserver

# Generate new migrations after editing models.py
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Open a Python shell with Django loaded
python manage.py shell

# Install a new package and update requirements
pip install <package>
pip freeze > requirements.txt
```

### Frontend

```powershell
# Run dev server
npm run dev

# Install a new package
npm install <package>

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

### Database

```powershell
# Connect to the database
psql -U postgres -d asmaan_db

# Inside psql:
\dt              -- List tables
\d properties_property   -- Describe a table
SELECT * FROM properties_property LIMIT 5;
\q               -- Quit
```

### Git

```powershell
git status                  # See what changed
git diff                    # See exact changes
git add .                   # Stage everything
git commit -m "ASM-X: ..."  # Commit
git push origin dev         # Push to GitHub
git pull origin dev         # Get latest from GitHub
```

---

## 14. Credits and acknowledgements

**Sprint 1 development:** Yawar Abbas (solo execution of all 32 tasks)
**Team members for documentation, testing, and Sprint 2+ contributions:** Syeda Misha Shah, Urwa Abbas Ahsan
**Supervisor / Product Owner:** Muhammad Nabeel
**Co-supervisor:** Dr. Muhammad Ahsan
**University:** University of Management and Technology (UMT), School of Systems and Technology

---

## 15. Questions?

If anything in this guide is unclear:
1. First, try to reproduce the issue
2. Check Section 9 (Common Problems)
3. Search the exact error message on Google or Stack Overflow
4. If still stuck, ask Yawar with: the exact command you ran, the full error message, and a screenshot

**Read this document end-to-end before starting Sprint 2.** It will save days of confusion.
