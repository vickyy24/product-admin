# Product Admin Dashboard

Production-style product administration dashboard built with Next.js App Router, React,
Tailwind CSS, Axios, and plain JavaScript.

## Local setup

```bash
npm install
npm run dev
```
Live : https://product-admin-tau.vercel.app/
Open [http://localhost:3000](http://localhost:3000).

Use the DummyJSON demo credentials:

- Username: `emilys`
- Password: `emilyspass`

## Available scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build and runs Next.js validation.
- `npm run start` starts the production server.
- `npm run lint` runs the Next.js ESLint checks.
- `npm run format` formats the source with the repository's four-space Prettier configuration.

## Completed scope

- Axios-only API layer with one shared client, authentication-token request interceptor,
  and centralized response error handling.
- Login, logout, request locking, token persistence, and protected product routes.
- URL-persisted search, category filter, sort, page, and page size.
- Debounced search with request identity protection so slow older results cannot replace newer results.
- Desktop product table and mobile product cards.
- Product details, images, reviews, not-found state, loading state, empty state, retry state,
  validated add/edit form, and delete confirmation.
- Four-space JavaScript formatting, reusable components, Tailwind styling, and responsive layout.

## Important implementation decisions

DummyJSON does not support searching and category filtering in the same API request. The dashboard
uses the search endpoint when a search term exists, then applies the selected category filter to the
returned page in the browser. This keeps the URL shareable while respecting the API limitation.

DummyJSON also does not persist add, edit, or delete requests. The app still sends every mutation
through Axios, then stores the returned mutation in local storage as a session overlay. Product
lists and details read that overlay so the user can immediately see the change without pretending
that it was saved remotely.

## A problem and fix

Fast search input can produce responses out of order when the API is delayed. The search field is
debounced, and each request receives an incrementing request identity. A response updates the UI
only when its identity is still the latest one.

## AI assistance

AI assistance was used for code scaffolding, API integration, and reviewing edge cases. The source
was then reorganized into small components and service modules so the behavior and implementation
can be explained and maintained directly.
