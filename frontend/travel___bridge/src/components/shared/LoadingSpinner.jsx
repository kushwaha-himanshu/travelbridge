
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'medium', className = '', fullScreen = false }) => {
  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const spinner = (
    <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]} ${className}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/10 backdrop-blur-xs">
        <div className="rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 flex flex-col items-center gap-3">
          {spinner}
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
