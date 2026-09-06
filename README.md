# Penverse — Current Affairs (News section)

A standalone React app for the Current Affairs / News feature: one side to
**read** the daily news feed with practice MCQs, one side to **publish**
new news items with an attached quiz.

Built with Vite + React, Redux Toolkit for state, Tailwind CSS for styling,
and Axios calling directly into the `news.model.js` / `news.controller.js` /
`news.routes.js` Express API.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```

Requires the Express backend running with `news.routes.js` mounted, e.g.:

```js
app.use('/api/v1/news', newsRoutes);
```

## Structure

```
src/
  api/newsApi.js          Axios calls — one function per backend route
  store/
    store.js              Redux store
    newsSlice.js          All async thunks (load by date, search, create,
                           update, delete, toggle-important) + reducers
  pages/
    ReaderPage.jsx         "Read" side — date-wise feed + title search
    UploadPage.jsx          "Upload" side — publish form
  components/
    layout/AppShell.jsx    Header, nav switcher (Read / Upload)
    reader/                DateNav, NewsList, NewsArticle, QuizPlayer
    upload/                NewsForm, QuizBuilder
  utils/date.js            Date formatting/shifting helpers
```

## Notes

- The reader's "Read" tab fetches `GET /news/date/:date` for the selected
  day, with a search box hitting `GET /news/search/title`.
- Bookmarking an article (the star icon) calls `PUT /news/:id` to toggle
  `isImportant` — wire the "Important" filter into the UI by dispatching
  `loadImportantNews` wherever you want that view.
- The quiz builder enforces the backend's validation client-side (exactly
  4 options, a chosen correct option) before submitting, so you get fast
  feedback instead of a round trip to find out a question is malformed.
- No auth/admin gate is included — if `/upload` should be restricted,
  add a route guard around `UploadPage`.
