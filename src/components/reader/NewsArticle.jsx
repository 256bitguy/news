import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleImportant } from '../../store/newsSlice.js';
import { readingTime } from '../../utils/text.js';
import QuizPlayer from './QuizPlayer.jsx';

export default function NewsArticle({ item, isHero = false }) {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (expanded && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [expanded, item]);

  const mins = readingTime(item.content);
  const quizCount = item.quizQuestions?.length || 0;

  return (
    <article
      className={
        isHero
          ? 'border-b-2 border-ink/10 pb-8 mb-2'
          : 'border-b border-ink/10 py-6'
      }
    >
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-left flex-1 group"
        >
          <div className="flex items-center gap-3 mb-2">
            {item.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] tracking-wideish uppercase text-gold border border-gold/30 rounded-full px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
            <span className="text-[11px] text-slate">
              {mins} min read{quizCount ? ` · ${quizCount} MCQ${quizCount > 1 ? 's' : ''}` : ''}
            </span>
          </div>

          <h2
            className={
              isHero
                ? 'font-display text-3xl text-ink leading-tight group-hover:text-ink/80 transition-colors'
                : 'font-display text-xl text-ink leading-snug group-hover:text-ink/80 transition-colors'
            }
          >
            {item.title}
          </h2>

          {!expanded && (
            <p
              className={
                isHero
                  ? 'text-[15px] text-slate mt-2.5 leading-relaxed line-clamp-3 max-w-2xl'
                  : 'text-sm text-slate mt-1.5 line-clamp-2'
              }
            >
              {item.content}
            </p>
          )}
        </button>

        <button
          onClick={() =>
            dispatch(
              toggleImportant({ id: item._id, isImportant: item.isImportant })
            )
          }
          className={`shrink-0 mt-1 text-lg transition-colors ${
            item.isImportant ? 'text-gold' : 'text-ink/20 hover:text-gold/60'
          }`}
          title={item.isImportant ? 'Remove bookmark' : 'Bookmark'}
        >
          ★
        </button>
      </div>

      <div
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div ref={contentRef} className="mt-4 space-y-5">
          <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line max-w-2xl">
            {item.content}
          </p>
          {item.source && (
            <p className="text-xs text-slate">Source: {item.source}</p>
          )}
          <QuizPlayer questions={item.quizQuestions} />
        </div>
      </div>
    </article>
  );
}
