
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PageHeader = ({ title, subtitle, onBack, action }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackClick}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          title="Go back"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h1>
          {subtitle && <p className="text-xs font-semibold text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
