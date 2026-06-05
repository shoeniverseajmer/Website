import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { Toaster, toast as hotToast } from 'react-hot-toast';

export const toast = {
  success(message: string) {
    return hotToast.success(message, {
      icon: <CheckCircle2 className="h-5 w-5 text-moss" />
    });
  },
  error(message: string) {
    return hotToast.error(message, {
      icon: <XCircle className="h-5 w-5 text-danger" />
    });
  },
  info(message: string) {
    return hotToast(message, {
      icon: <Info className="h-5 w-5 text-gold" />
    });
  },
  promise<T>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) {
    return hotToast.promise(promise, messages);
  }
};

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={10}
      toastOptions={{
        duration: 3200,
        style: {
          border: '1px solid rgba(17,17,17,0.08)',
          borderRadius: '999px',
          boxShadow: '0 18px 60px rgba(17,17,17,0.12)',
          color: '#111111',
          fontWeight: 800,
          padding: '12px 16px'
        },
        success: {
          style: {
            background: '#ffffff'
          }
        },
        error: {
          style: {
            background: '#fff7f7'
          }
        }
      }}
    />
  );
}
