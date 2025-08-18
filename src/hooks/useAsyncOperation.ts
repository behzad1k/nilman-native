import { useState, useCallback, useRef } from 'react';
import { useLoading } from '@/src/components/contexts/LoadingContext';

interface UseAsyncOperationOptions {
  // Loading behavior
  useGlobalLoading?: boolean;
  loadingMessage?: string;
  // Callbacks
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
  // Error handling
  showErrorAlert?: boolean;
  errorTitle?: string;
  // Retry functionality
  maxRetries?: number;
  retryDelay?: number;
  // Cancellation support
  cancelable?: boolean;
}

interface UseAsyncOperationReturn {
  execute: (asyncFunction: () => Promise<any>) => Promise<any>;
  loading: boolean;
  error: Error | null;
  data: any;
  retry: () => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

export const useAsyncOperation = (
  options: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn => {
  const {
    useGlobalLoading = false,
    loadingMessage,
    onSuccess,
    onError,
    onFinally,
    showErrorAlert = false,
    errorTitle = 'Error',
    maxRetries = 0,
    retryDelay = 10000,
    cancelable = false,
  } = options;

  // State management
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  // Refs for cancellation and retry
  const cancelRef = useRef<boolean>(false);
  const lastAsyncFunctionRef = useRef<(() => Promise<any>) | null>(null);
  const retryCountRef = useRef<number>(0);

  // Global loading context
  const { showLoading, hideLoading } = useLoading();

  // Reset function
  const reset = useCallback(() => {
    setError(null);
    setData(null);
    retryCountRef.current = 0;
    cancelRef.current = false;
  }, []);

  // Cancel function
  const cancel = useCallback(() => {
    if (cancelable) {
      cancelRef.current = true;
      if (useGlobalLoading) {
        hideLoading();
      } else {
        setLocalLoading(false);
      }
    }
  }, [cancelable, useGlobalLoading, hideLoading]);

  // Internal execute function that handles retries
  const executeWithRetries = useCallback(
    async (asyncFunction: () => Promise<any>, isRetry: boolean = false) => {
      // Reset cancellation flag
      cancelRef.current = false;

      // Clear previous error only on initial execution, not retries
      if (!isRetry) {
        setError(null);
        retryCountRef.current = 0;
      }

      try {
        // Start loading
        if (useGlobalLoading) {
          showLoading(loadingMessage);
        } else {
          setLocalLoading(true);
        }

        // Execute the async function with retry logic
        let lastError: Error | null = null;
        let currentRetry = 0;

        while (currentRetry <= maxRetries) {
          try {
            // Check for cancellation
            if (cancelable && cancelRef.current) {
              throw new Error('Operation cancelled');
            }

            const result = await asyncFunction();

            // Check for cancellation after execution
            if (cancelable && cancelRef.current) {
              throw new Error('Operation cancelled');
            }

            // Success - store data and call success callback
            setData(result);
            retryCountRef.current = 0; // Reset only on success
            if (onSuccess) {
              onSuccess(result);
            }
            return result;
          } catch (err) {
            lastError = err instanceof Error ? err : new Error('Unknown error occurred');

            // If it's a cancellation, don't retry
            if (lastError.message === 'Operation cancelled') {
              throw lastError;
            }

            currentRetry++;
            retryCountRef.current = currentRetry;

            // If we haven't exceeded max retries, wait and try again
            if (currentRetry <= maxRetries) {
              await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
          }
        }

        // If we get here, all retries failed
        throw lastError;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unexpected error occurred');
        setError(error);

        // Handle error callback
        if (onError) {
          onError(error);
        }

        // Show error alert if requested
        if (showErrorAlert && !cancelable) {
          console.error(`${errorTitle}:`, error.message);
        }

        // Re-throw the error so calling code can handle it
        throw error;
      } finally {
        // Stop loading
        if (useGlobalLoading) {
          hideLoading();
        } else {
          setLocalLoading(false);
        }

        // Call finally callback
        if (onFinally) {
          onFinally();
        }
      }
    },
    [
      useGlobalLoading,
      loadingMessage,
      showLoading,
      hideLoading,
      onSuccess,
      onError,
      onFinally,
      showErrorAlert,
      errorTitle,
      maxRetries,
      retryDelay,
      cancelable,
    ]
  );

  // Main execute function
  const execute = useCallback(
    async (asyncFunction: () => Promise<any>) => {
      // Store the function for retry capability
      lastAsyncFunctionRef.current = asyncFunction;
      return executeWithRetries(asyncFunction, false);
    },
    [executeWithRetries]
  );

  // Retry function - only retry if there was a previous failure
  const retry = useCallback(async () => {
    if (lastAsyncFunctionRef.current && error && retryCountRef.current < maxRetries) {
      await executeWithRetries(lastAsyncFunctionRef.current, true);
    }
  }, [executeWithRetries, error, maxRetries]);

  return {
    execute,
    loading: useGlobalLoading ? false : localLoading,
    error,
    data,
    retry,
    cancel,
    reset,
  };
};
