# HelloJoy AI

A one-page sales site for HelloJoy AI, an AI receptionist service for local businesses. Visitors can talk to a live demo receptionist from the page before booking a meeting.

The demo receptionist is the PawCare voice receptionist. This site calls its API to start browser voice calls; no provider key is held here.

## Stack

React, TypeScript and Vite. Node 22.

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:5174.

For the voice demo to connect locally, run the PawCare backend on port 8000 and add `http://localhost:5174` to its `CORS_ALLOWED_ORIGINS` (comma-separated).

## Settings

All are `VITE_` variables, so they are public and compiled into the bundle. Change one, then rebuild.

| Variable | What it does |
|---|---|
| `VITE_DEMO_API_URL` | The demo receptionist's API, no trailing slash. Required for the voice demo |
| `VITE_BOOKING_URL` | Meeting link for the main buttons ("Book a meeting") |
| `VITE_SIGNUP_URL` | Used for the main buttons when there is no meeting link |
| `VITE_AGENCY_PHONE` | Your number in E.164, for example `+13105550123`. Shows click-to-call |
| `VITE_SERVICE_AREA` | Defaults to `Los Angeles` |

With neither link nor phone set, the main buttons open the demo receptionist.

## Deploy on Netlify

1. Push this folder to its own GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project** and pick the repository. `netlify.toml` supplies the build settings.
3. Under **Site configuration → Environment variables**, set `VITE_DEMO_API_URL` to the PawCare backend URL, plus any optional variables above. Then **Deploys → Trigger deploy**.
4. On the PawCare backend (Railway), add this site's exact origin, for example `https://hellojoyai.netlify.app`, to `CORS_ALLOWED_ORIGINS`, separated by a comma from the existing origin. Redeploy the backend.
5. Open the site, press **Talk to our receptionist**, and allow the microphone.
