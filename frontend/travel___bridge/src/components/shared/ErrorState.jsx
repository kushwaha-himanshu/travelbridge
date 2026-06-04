
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-rose-100 bg-rose-50/50 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-3 shadow-sm border border-rose-200">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-900">Something went wrong</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">{message || "We encountered an error processing your request."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-1.5 rounded-xl bg-white border border-rose-200 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 transition shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
