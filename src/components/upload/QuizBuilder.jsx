const LETTERS = ['A', 'B', 'C', 'D'];

const emptyQuestion = () => ({
  statement: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  explanation: '',
});

export default function QuizBuilder({ questions, onChange }) {
  const updateQuestion = (index, patch) => {
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  };

  const updateOption = (qIndex, optIndex, value) => {
    const options = [...questions[qIndex].options];
    options[optIndex] = value;
    updateQuestion(qIndex, { options });
  };

  const addQuestion = () => onChange([...questions, emptyQuestion()]);

  const removeQuestion = (index) =>
    onChange(questions.filter((_, i) => i !== index));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate tracking-wideish uppercase">
          Quiz questions ({questions.length})
        </p>
        <button
          type="button"
          onClick={addQuestion}
          className="text-xs text-gold hover:underline"
        >
          + Add question
        </button>
      </div>

      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="border border-ink/10 rounded-lg p-4 bg-white space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <textarea
              value={q.statement}
              onChange={(e) =>
                updateQuestion(qIndex, { statement: e.target.value })
              }
              placeholder={`Question ${qIndex + 1} statement`}
              rows={2}
              className="flex-1 text-sm border border-ink/15 rounded-md px-3 py-2 focus:outline-none focus:border-gold resize-none"
            />
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="text-xs text-incorrect hover:underline shrink-0 mt-2"
            >
              Remove
            </button>
          </div>

          <div className="space-y-2">
            {q.options.map((opt, optIndex) => (
              <label
                key={optIndex}
                className="flex items-center gap-3 text-sm"
              >
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctOptionIndex === optIndex}
                  onChange={() =>
                    updateQuestion(qIndex, { correctOptionIndex: optIndex })
                  }
                  className="accent-gold"
                />
                <span className="text-xs font-semibold text-slate w-4">
                  {LETTERS[optIndex]}
                </span>
                <input
                  value={opt}
                  onChange={(e) =>
                    updateOption(qIndex, optIndex, e.target.value)
                  }
                  placeholder={`Option ${LETTERS[optIndex]}`}
                  className="flex-1 border border-ink/15 rounded-md px-3 py-1.5 focus:outline-none focus:border-gold"
                />
              </label>
            ))}
          </div>

          <input
            value={q.explanation}
            onChange={(e) =>
              updateQuestion(qIndex, { explanation: e.target.value })
            }
            placeholder="Explanation (optional)"
            className="w-full text-sm border border-ink/15 rounded-md px-3 py-2 focus:outline-none focus:border-gold"
          />
        </div>
      ))}

      {questions.length === 0 && (
        <p className="text-sm text-slate">
          No questions yet — add at least one, or publish the news with no
          quiz attached.
        </p>
      )}
    </div>
  );
}

export { emptyQuestion };
