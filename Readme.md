# Asmaan.com

Pakistan's first satellite-first, AI-powered, verified real estate marketplace.

> "Har Pata Apko Pata Hai"

## Project Structure

asmaan.com/
├── asmaan-backend/   # Django REST API
└── asmaan-frontend/  # React + Vite + Tailwind

## Backend Setup

```bash
cd asmaan-backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Frontend Setup

```bash
cd asmaan-frontend
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your keys.
Never commit `.env` to Git.

## Tech Stack

- Backend: Django 5 + Django REST Framework
- Frontend: React 18 + Vite + Tailwind CSS
- Database: PostgreSQL + PostGIS
- Map: Mapbox GL JS (satellite)
- ML: scikit-learn + XGBoost
- Cloud: Google Cloud Platform