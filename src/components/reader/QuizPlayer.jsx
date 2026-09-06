import { useState } from 'react';

const LETTERS = ['A', 'B', 'C', 'D'];

function QuestionCard({ question, index }) {
  const [selected, setSelected] = useState(null);

  const answered = selected !== null;

  return (
    <div className="border border-ink/10 rounded-lg p-5 bg-white">
      <p className="text-xs text-slate mb-2">Question {index + 1}</p>
      <p className="font-display text-base text-ink mb-4">
        {question.statement}
      </p>
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctOptionIndex;
          const isSelected = i === selected;

          let stateClasses = 'border-ink/15 hover:border-gold/60';
          if (answered && isCorrect) {
            stateClasses = 'border-correct bg-correct/5';
          } else if (answered && isSelected && !isCorrect) {
            stateClasses = 'border-incorrect bg-incorrect/5';
          }

          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => setSelected(i)}
              className={`w-full flex items-start gap-3 text-left px-4 py-2.5 rounded-md border transition-colors disabled:cursor-default ${stateClasses}`}
            >
              <span className="font-body text-xs font-semibold text-slate mt-0.5">
                {LETTERS[i]}
              </span>
              <span className="text-sm text-ink flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 pt-4 border-t border-ink/10">
          <p
            className={`text-sm font-semibold mb-1 ${
              selected === question.correctOptionIndex
                ? 'text-correct'
                : 'text-incorrect'
            }`}
          >
            {selected === question.correctOptionIndex
              ? 'Correct'
              : `Incorrect — correct answer is ${LETTERS[question.correctOptionIndex]}`}
          </p>
          {question.explanation && (
            <p className="text-sm text-slate leading-relaxed">
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuizPlayer({ questions }) {
  if (!questions?.length) return null;

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate tracking-wideish uppercase">
        Practice — {questions.length} question{questions.length > 1 ? 's' : ''}
      </p>
      {questions.map((q, i) => (
        <QuestionCard key={q._id || i} question={q} index={i} />
      ))}
    </div>
  );
}
