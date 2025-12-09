import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
  loading: (message: string) => {
    return toast.loading(message);
  },
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
};

//import { showToast } from '@/lib/toast';

// Success
//showToast.success('Login successful!');

// Error
//showToast.error('Invalid credentials');

// Loading with dismiss
//const loadingToast = showToast.loading('Logging in...');
// ... do async work ...
//showToast.dismiss(loadingToast);
//showToast.success('Done!');