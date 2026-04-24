# Asmaan.com — Master Project Instructions

## 1. Project Identity & Core Concept

**Asmaan.com is Pakistan's first map-first, AI-enriched, managed property platform**^^. **It is designed to address the lack of transparency, stale listings, and agent fraud prevalent in the local real estate market**^^.

* **Verified Workflow:** Every listing is physically visited by the team, professionally photographed, and approved by an administrator before going live^^^^^^^^.
* **Map-First Interface:** The primary interface is a satellite map powered by Mapbox GL JS, displaying price-label pins over real aerial imagery of Pakistani cities^^^^^^^^^^^^^^^^^^.
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

**Follow these instructions to get the local development environment running for Sprint 1**^^.

### Backend (Django) Setup

1. **Clone the GitHub repository to your local machine**^^.
2. **Navigate to the **`<span class="citation-505">asmaan-backend</span>` directory^^.
3. Create and activate a Python virtual environment.
4. **Install the required dependencies using the provided file: **`<span class="citation-504">pip install -r requirements.txt</span>`^^^^^^.
5. **Duplicate the **`<span class="citation-503">.env.example</span>` file, rename it to `<span class="citation-503">.env</span>`, and populate it with your local PostgreSQL credentials and secret keys^^^^^^.
6. **Ensure your local PostgreSQL 16 database has the PostGIS extension enabled**^^^^^^^^.
7. **Run **`<span class="citation-501">python manage.py makemigrations</span>` and `<span class="citation-501">python manage.py migrate</span>` to generate the database tables^^.
8. Start the development server using `python manage.py runserver`.

### Frontend (React) Setup

1. **Navigate to the **`<span class="citation-500">asmaan-frontend</span>` directory^^.
2. **Install the Node modules by running **`<span class="citation-499">npm install</span>`^^.
3. **Create a **`<span class="citation-498">.env</span>` file in the frontend root and add your Mapbox token: `<span class="citation-498">REACT_APP_MAPBOX_TOKEN=your-token</span>`^^.
4. Start the React development server by running `npm start`.

---

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

## 7. Master Timeline & Roadmap

**The project execution spans 14 sprints divided into two major phases**^^.

* **FYP-I (Sprints 1-6 | Apr – Jul 2025):** The focus is on the core platform foundation^^. **This includes setting up the Django/React architecture, integrating the Mapbox satellite map, building the property models, and establishing the administrative review workflow**^^^^^^^^.
* **Break Sprint (Sprint 7 | Aug – Sep 2025):** A dedicated period for ML research, manually mapping static ISP and load-shedding JSON data for Lahore, and labeling the 30 Lahore areas for ground-truth desirability^^^^^^^^.
* **FYP-II (Sprints 8-14 | Oct 2025 – Jan 2026):** The focus shifts to building and testing the AI modules (NLP, ML Scoring, and Recommendations), executing the GCP deployment, seeding 20 real Lahore listings, and finalizing documentation for the project defense^^^^^^^^^^^^^^^^^^.
