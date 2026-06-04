import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const SuccessToast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-md border ${
        isSuccess
          ? 'bg-emerald-500/90 text-white border-emerald-400'
          : 'bg-rose-500/90 text-white border-rose-400'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0" />
      )}
      <span className="text-sm font-semibold pr-2">{message}</span>
      <button
        onClick={onClose}
        className="rounded-full p-1 hover:bg-white/20 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};

export default SuccessToast;
