import NewsArticle from './NewsArticle.jsx';

export default function NewsList({ items, status, error, allowHero = true }) {
  if (status === 'loading') {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-lg text-slate italic">
          Setting today's edition…
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <p className="text-sm text-incorrect py-10 text-center">
        Couldn't load news: {error}
      </p>
    );
  }

  if (!items?.length) {
    return (
      <div className="py-16 text-center border-t border-ink/10">
        <p className="font-display text-lg text-ink/70 mb-1">
          No edition published yet
        </p>
        <p className="text-sm text-slate">
          Check back later, or pick another date above.
        </p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item, i) => (
        <NewsArticle
          key={item._id}
          item={item}
          isHero={allowHero && i === 0}
        />
      ))}
    </div>
  );
}
