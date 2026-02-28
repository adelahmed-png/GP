# Help Culprit Recognition — Technical Summary

A technical overview of the project for review before pushing to GitHub.

---

## 1. Project Overview

### What the project does

**Help Culprit Recognition** is a React frontend application that helps investigators find suspects by matching text descriptions with suspect images using vector similarity.

- Users create **investigations**, upload suspect images, and enter a **culprit description** (e.g. “bald man with beard”).
- The system (when connected to a backend) returns **ranked matches** with similarity scores.
- The UI displays results as cards with suspect thumbnails, scores, and progress bars.

### Main goal

Provide a clean, modern interface for investigators to run similarity search (text → images) and view ranked suspect matches, with a working demo experience when the backend API is not yet deployed.

---

## 2. Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19.x |
| **Routing** | React Router DOM 7.x |
| **Build tool** | Vite 7.x |
| **Language** | JavaScript (JSX) |
| **Styling** | Tailwind CSS 4.x (with `@tailwindcss/vite` plugin) |
| **Font** | DM Sans (Google Fonts) |

- **Bundler:** Vite with SWC via `@vitejs/plugin-react-swc`.
- **Linting:** ESLint with React and React Hooks plugins.
- **No backend framework** — frontend only; expects a separate search API.

---

## 3. Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route-level views
├── services/       # API and external calls
├── hooks/          # Custom React hooks (e.g. investigations context)
├── App.jsx         # Root layout, router, sidebar + main content
├── main.jsx        # React entry, mounts App
└── index.css       # Global styles, Tailwind import, base styles
```

### Purpose of main folders

- **`src/components`** — Modular UI pieces used across the app:
  - **Sidebar** — App title, “New Investigation +”, investigation list.
  - **InvestigationList** — List of investigations with active state.
  - **InvestigationModal** — New investigation form (name, image upload, preview).
  - **ResultsPanel** — “Top Matches” section, skeleton or result cards, empty state.
  - **ResultCard** — Single match: rank, image, score, progress bar, Best Match badge.
  - **SkeletonResultCard** — Loading placeholder matching ResultCard layout.
  - **DescriptionInput** — Culprit description input + Search button.
  - **SettingsDropdown** — Model version and similarity metric selectors.
  - **ImagePreviewModal** — Full-size image preview (backdrop, ESC, close button).

- **`src/pages`** — Full-page views for each route:
  - **Home** — Landing when no investigation is selected; link to first investigation.
  - **InvestigationPage** — Header, results panel, description input, settings; runs search and shows Top Matches.

- **`src/services`** — Backend and external logic:
  - **api.js** — `searchByDescription()`, optional `uploadImages()`; handles API calls and fallback to demo results when the API is unavailable.

- **`src/hooks`** — Shared state and behavior:
  - **useInvestigations.jsx** — Context provider and hook for the list of investigations (name, id, imageUrls), persisted in `localStorage`; provides `addInvestigation`, `getInvestigation`.

---

## 4. Main Features

- **Investigation system** — Create named investigations; list in sidebar; select one to view/search; data persisted in `localStorage`.
- **Image upload** — In “New Investigation” modal: multi-file image upload with preview thumbnails and remove-before-submit.
- **Image preview in modal** — Clicking an upload thumbnail opens a larger preview modal (backdrop, centered image, close via backdrop/ESC/×).
- **Culprit description search** — Bottom text input + Search button; sends description (and settings) to search API.
- **Ranking results with similarity scores** — Results shown as #1, #2, #3… with numeric score (e.g. 0.95) and percentage.
- **Best match highlighting** — First result (#1) has distinct styling (blue border, background) and “Best Match ⭐” badge.
- **Similarity progress bars** — Each result card has a horizontal bar (percentage) and optional hover/transition; best match uses a brighter bar color.
- **Skeleton loading** — While search is in progress, 5 skeleton cards are shown instead of a spinner.
- **Hover effects on images** — Suspect images and upload thumbnails use `hover:scale-105` and optional shadow for a light zoom effect.
- **Image preview when clicking results** — Clicking a result thumbnail opens ImagePreviewModal with the suspect image (same modal component as upload preview).
- **Settings** — Model version (CLIP, OpenCLIP, Custom Model) and similarity metric (Cosine, Dot Product, Euclidean) dropdowns; values sent with each search request.

---

## 5. Search Logic

### API call behavior

- **Endpoint:** `POST ${API_BASE}/search` (default `/api` or `VITE_API_URL`).
- **Body:** `{ investigationId, description, modelVersion, similarityMetric }`.
- **Success:** Expects JSON with an array of `{ image, score }` (or `data.results`); returned as-is to the UI.

### Fallback when backend is unavailable

- On **network error** or **non-OK response**, the catch block in `searchByDescription` does **not** throw.
- It uses **fallback images** passed in options (`fallbackImages`, typically `investigation?.imageUrls`).
- **Normalization:** Entries can be URL strings or objects like `{ file, url }`; only the URL is extracted. Empty/invalid entries are filtered out.
- **Demo results:** For each URL, returns `{ image: imageUrl, score: Math.max(0.95 - index * 0.05, 0.5) }` so scores are 0.95, 0.90, 0.85… with a minimum of 0.5.
- If there are no fallback URLs, returns `[]` and the UI shows the empty state.
- A console warning is logged when using demo results: `"API unavailable — using investigation images as demo results"`.

### Score generation (fallback)

- `score = Math.max(0.95 - index * 0.05, 0.5)`.
- First image: 0.95, then 0.90, 0.85, etc., with a floor of 0.5 so the progress bar and ranking still look sensible.

---

## 6. Image Handling

### Placeholder image

- **Constant:** `https://placehold.co/100x100/1e293b/94a3b8?text=No+Image` (dark theme–friendly).
- **When used:** If `result.image` (or the prop passed to ResultCard) is missing or null, the card uses this URL as `src` so the UI never shows a blank or broken image by default.

### Broken image fallback (`onError`)

- ResultCard’s `<img>` has `onError` that:
  - Sets `e.currentTarget.onerror = null` (avoids infinite loop if placeholder also fails).
  - Sets `e.currentTarget.src = PLACEHOLDER_IMAGE`.
- So any failed load (invalid URL, 404, CORS, etc.) is replaced by the same placeholder.

### Support for URL strings and `{ file, url }` objects

- In **api.js** fallback, `fallbackImages` is normalized before building demo results:
  - `string` → use as URL.
  - `object` with `url` → use `img.url` (e.g. `{ file: File, url: "blob:..." }` from uploads).
  - Otherwise → discard (filtered out).
- This allows the app to pass either stored URL strings or in-memory upload objects and still get valid demo result URLs.

---

## 7. Investigation Switching Logic

- **InvestigationPage** reads the active investigation from the route: `const { id } = useParams()`.
- A **useEffect** depends on `id`:
  - When `id` changes (user selects another investigation in the sidebar or navigates to another URL), the effect runs.
  - It calls: `setResults([])`, `setError(null)`, `setIsLoading(false)`.
- **Result:** Top Matches clear immediately; error and loading state reset. The new investigation shows the empty state (“No matches yet. Enter a suspect description to start searching.”) until the user runs a new search. Each investigation effectively has its own search state.

---

## 8. Deployment

- The **frontend** is intended to be deployed on **Vercel**, connected to the **GitHub** repository.
- Build command: `npm run build` (Vite production build).
- The app is static/client-side; environment variable `VITE_API_URL` can be set in Vercel to point to the backend search API when available.
- No backend is deployed as part of this repo; the app is designed to work with or without a live API (using fallback demo results when the API is unavailable).

---

## 9. Current Limitations

- **Backend API not yet connected** — The search endpoint (`/api/search` or `VITE_API_URL`) may not be deployed or may be on a different origin; CORS and network errors are handled by falling back to demo results.
- **Search uses fallback demo results when API is unavailable** — Ranked results are then generated from the current investigation’s uploaded images with synthetic scores (0.95, 0.90, …), not from real vector similarity.
- **Investigations and images are client-only** — Stored in `localStorage` and in-memory blob URLs; no server persistence. Refreshing or using another device does not restore investigations unless a backend is added.
- **Upload endpoint optional** — `uploadImages()` in api.js is defined but not required for the current flow; images are kept in the client (blob URLs) for the fallback demo.
- **No authentication or multi-user support** — Single-user, single-browser state only.

---

*End of technical summary.*
