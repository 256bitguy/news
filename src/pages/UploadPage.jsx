import NewsForm from '../components/upload/NewsForm.jsx';

export default function UploadPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-slate tracking-wideish uppercase mb-1">
          Publish
        </p>
        <h2 className="font-display text-2xl text-ink">New current-affairs entry</h2>
        <p className="text-sm text-slate mt-1">
          Posts a single news item for the selected date, with an optional
          MCQ set attached.
        </p>
      </div>
      <NewsForm />
    </div>
  );
}
