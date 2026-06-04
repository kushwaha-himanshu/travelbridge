
import { HelpCircle } from 'lucide-react';

export const EmptyState = ({ title, message, icon: Icon = HelpCircle, actionText, onAction, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/20 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3 shadow-inner">
        <Icon className="h-5 w-5 stroke-1.5" />
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title || "No data available"}</h3>
      <p className="mt-1 text-xs text-slate-400 max-w-xs leading-normal">{message || "There are no items to display in this list."}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-xl bg-blue-50 border border-blue-100 px-4.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100/50 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
