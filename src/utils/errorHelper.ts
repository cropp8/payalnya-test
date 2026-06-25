import type { ToastInterface } from 'vue-toastification';

import { ApiError } from '@/api/services';

export const handleStoreError = (
  error: unknown,
  fallbackMessage: string,
  toast: ToastInterface,
) => {
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    toast.error(fallbackMessage);
  }
};
