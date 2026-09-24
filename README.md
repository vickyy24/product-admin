# Product Admin Dashboard

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and use `emilys` / `emilyspass`.

## Finished

- Axios-only API layer with auth-token and centralized error interceptors.
- Login/logout, protected product routes, URL-driven search, filters, sorting, pagination, and page size.
- Responsive desktop table and mobile cards.
- Product details, reviews, validation, add/edit/delete confirmation, loading, empty, retry, and not-found states.
- Debounced search plus request-id protection so stale responses cannot replace newer results.

DummyJSON does not persist mutations. Add/edit/delete calls are made to the API and the returned mutation is stored as a local override so the app can show the changed item during the session. Search and category filtering are combined client-side because the API does not support both parameters in one request.
