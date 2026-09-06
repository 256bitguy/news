import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCreateStatus, submitNews } from '../../store/newsSlice.js';
import { toISODate } from '../../utils/date.js';
import QuizBuilder, { emptyQuestion } from './QuizBuilder.jsx';

const emptyForm = () => ({
  date: toISODate(new Date()),
  title: '',
  content: '',
  source: '',
  tags: '',
});

function validate(form, questions) {
  const errors = [];
  if (!form.date) errors.push('Date is required.');
  if (!form.title.trim()) errors.push('Title is required.');
  if (!form.content.trim()) errors.push('Content is required.');

  questions.forEach((q, i) => {
    if (!q.statement.trim()) {
      errors.push(`Question ${i + 1}: statement is required.`);
    }
    const filled = q.options.filter((o) => o.trim());
    if (filled.length !== 4) {
      errors.push(`Question ${i + 1}: all 4 options must be filled in.`);
    }
    if (q.correctOptionIndex < 0 || q.correctOptionIndex > 3) {
      errors.push(`Question ${i + 1}: pick a correct option.`);
    }
  });

  return errors;
}

export default function NewsForm() {
  const dispatch = useDispatch();
  const { createStatus, createError } = useSelector((s) => s.news);
  const [form, setForm] = useState(emptyForm());
  const [questions, setQuestions] = useState([]);
  const [formErrors, setFormErrors] = useState([]);

  const handleField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(form, questions);
    setFormErrors(errors);
    if (errors.length) return;

    dispatch(
      submitNews({
        date: form.date,
        title: form.title.trim(),
        content: form.content.trim(),
        source: form.source.trim() || null,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        quiz: questions.map((q) => ({
          statement: q.statement.trim(),
          options: q.options.map((o) => o.trim()),
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation.trim() || null,
        })),
      })
    ).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setForm(emptyForm());
        setQuestions([]);
        setFormErrors([]);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4">
        <div>
          <label className="block text-xs text-slate mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            max={toISODate(new Date())}
            onChange={handleField('date')}
            className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-xs text-slate mb-1">Title</label>
          <input
            value={form.title}
            onChange={handleField('title')}
            placeholder="Cabinet approves new PM-KISAN scheme amendments"
            className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate mb-1">Content</label>
        <textarea
          value={form.content}
          onChange={handleField('content')}
          rows={6}
          placeholder="Full article text…"
          className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate mb-1">
            Source (optional)
          </label>
          <input
            value={form.source}
            onChange={handleField('source')}
            placeholder="PIB"
            className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-xs text-slate mb-1">
            Tags (comma-separated)
          </label>
          <input
            value={form.tags}
            onChange={handleField('tags')}
            placeholder="polity, schemes, agriculture"
            className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="border-t border-ink/10 pt-5">
        <QuizBuilder questions={questions} onChange={setQuestions} />
        {questions.length === 0 && (
          <button
            type="button"
            onClick={() => setQuestions([emptyQuestion()])}
            className="mt-2 text-xs text-gold hover:underline"
          >
            + Add a quiz question
          </button>
        )}
      </div>

      {formErrors.length > 0 && (
        <ul className="text-sm text-incorrect space-y-1">
          {formErrors.map((err, i) => (
            <li key={i}>· {err}</li>
          ))}
        </ul>
      )}

      {createStatus === 'failed' && createError && (
        <p className="text-sm text-incorrect">Server error: {createError}</p>
      )}
      {createStatus === 'succeeded' && (
        <p className="text-sm text-correct">News item published.</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={createStatus === 'loading'}
          className="bg-ink text-paper text-sm font-medium px-5 py-2.5 rounded-md hover:bg-ink-700 transition-colors disabled:opacity-50"
        >
          {createStatus === 'loading' ? 'Publishing…' : 'Publish news'}
        </button>
        {createStatus !== 'idle' && (
          <button
            type="button"
            onClick={() => dispatch(clearCreateStatus())}
            className="text-xs text-slate hover:underline"
          >
            Dismiss
          </button>
        )}
      </div>
    </form>
  );
}
