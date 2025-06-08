# Bakery Demand AI App

This repository contains a prototype application for predicting product demand in bakery branches. The project consists of a React + Vite frontend and a FastAPI backend written in Python.

## Frontend
The frontend lives in the `frontend/` directory and uses React with Vite. It provides a minimal interface to interact with the backend.

### Available Scripts
- `npm run dev` – start the development server
- `npm run build` – build the production bundle
- `npm run preview` – preview the production build

Install dependencies with `npm install` inside the `frontend` folder.

## Backend
The backend lives in the `backend/` directory and uses FastAPI. It exposes a `/predict` endpoint that accepts a branch name, `horizon` and time `window` for the forecast. The backend generates predictions with Nixtla's **neuralforecast** library and considers extra factors like price, product placement and weather.

```bash
uvicorn main:app --reload
```

Install dependencies from `backend/requirements.txt` using `pip`.

## Purpose
The app is an early prototype that will help bakery managers plan the demand for bread, pastries and other goods for the next days.
