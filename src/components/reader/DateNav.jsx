import { formatLong, shiftDate, toISODate } from '../../utils/date.js';

export default function DateNav({ date, onChange, count }) {
  const isToday = date === toISODate(new Date());

  return (
    <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-6">
      <button
        onClick={() => onChange(shiftDate(date, -1))}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-ink/15 text-ink hover:border-gold hover:text-gold transition-colors"
        aria-label="Previous day"
      >
        ‹
      </button>

      <div className="text-center">
        <p className="font-display text-lg text-ink">{formatLong(date)}</p>
        <div className="flex items-center justify-center gap-3 mt-1">
          <input
            type="date"
            value={date}
            max={toISODate(new Date())}
            onChange={(e) => onChange(e.target.value)}
            className="text-xs text-slate bg-transparent border-none focus:outline-none cursor-pointer"
          />
          {!isToday && (
            <button
              onClick={() => onChange(toISODate(new Date()))}
              className="text-xs text-gold hover:underline"
            >
              Jump to today
            </button>
          )}
          {typeof count === 'number' && count > 0 && (
            <>
              <span className="text-ink/15">·</span>
              <span className="text-xs text-slate">
                {count} stor{count === 1 ? 'y' : 'ies'}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => onChange(shiftDate(date, 1))}
        disabled={isToday}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-ink/15 text-ink hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:hover:border-ink/15 disabled:hover:text-ink"
        aria-label="Next day"
      >
        ›
      </button>
    </div>
  );
}
