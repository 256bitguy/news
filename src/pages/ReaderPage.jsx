import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadNewsByDate,
  searchNews,
  setSelectedDate,
} from '../store/newsSlice.js';
import DateNav from '../components/reader/DateNav.jsx';
import NewsList from '../components/reader/NewsList.jsx';

export default function ReaderPage() {
  const dispatch = useDispatch();
  const { selectedDate, byDate, listStatus, listError, searchResults } =
    useSelector((s) => s.news);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    dispatch(loadNewsByDate(selectedDate));
  }, [dispatch, selectedDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearching(false);
      return;
    }
    setSearching(true);
    dispatch(searchNews(query.trim()));
  };

  const items = searching ? searchResults : byDate[selectedDate];

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/60 text-sm">
          ⌕
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news by title…"
          className="w-full border border-ink/15 rounded-full pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gold transition-colors"
        />
      </form>

      {searching ? (
        <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-6">
          <p className="text-sm text-slate">
            Results for <span className="text-ink">"{query}"</span>
          </p>
          <button
            onClick={() => {
              setSearching(false);
              setQuery('');
            }}
            className="text-xs text-gold hover:underline"
          >
            Back to edition
          </button>
        </div>
      ) : (
        <DateNav
          date={selectedDate}
          onChange={(d) => dispatch(setSelectedDate(d))}
          count={byDate[selectedDate]?.length}
        />
      )}

      <NewsList
        items={items}
        status={searching ? 'succeeded' : listStatus}
        error={listError}
        allowHero={!searching}
      />
    </div>
  );
}
