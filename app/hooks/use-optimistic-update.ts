import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface OptimisticUpdateOptions<T, R> {
  /** Function to update the UI optimistically */
  updateFn: (data: T) => void;
  /** Function to revert the UI on error */
  revertFn: (data: T) => void;
  /** API call to perform */
  apiFn: (data: T) => Promise<R>;
  /** Success message */
  successMessage?: string;
  /** Error message */
  errorMessage?: string;
  /** Callback on success */
  onSuccess?: (result: R) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Hook for optimistic UI updates
 * Updates UI immediately, then calls API. Reverts on error.
 * 
 * Usage:
 * const { execute, isLoading } = useOptimisticUpdate({
 *   updateFn: (task) => updateTaskInUI(task),
 *   revertFn: (task) => revertTaskInUI(task),
 *   apiFn: (task) => api.updateTask(task),
 * });
 */
export function useOptimisticUpdate<T, R = void>({
  updateFn,
  revertFn,
  apiFn,
  successMessage,
  errorMessage = 'Failed to update',
  onSuccess,
  onError,
}: OptimisticUpdateOptions<T, R>) {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (data: T): Promise<R | null> => {
      setIsLoading(true);

      // Optimistically update the UI
      updateFn(data);

      try {
        // Perform the API call
        const result = await apiFn(data);

        // Success!
        if (successMessage) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        setIsLoading(false);
        return result;
      } catch (error) {
        // Revert the optimistic update
        revertFn(data);

        // Show error
        const errorMsg = error instanceof Error ? error.message : errorMessage;
        toast.error(errorMsg);

        if (onError) {
          onError(error as Error);
        }

        setIsLoading(false);
        return null;
      }
    },
    [updateFn, revertFn, apiFn, successMessage, errorMessage, onSuccess, onError]
  );

  return { execute, isLoading };
}

/**
 * Simpler version for toggling boolean states
 * Usage:
 * const { toggle, isLoading } = useOptimisticToggle({
 *   initialValue: task.completed,
 *   apiFn: () => api.toggleTask(task.id),
 * });
 */
export function useOptimisticToggle({
  initialValue,
  apiFn,
  onSuccess,
  onError,
}: {
  initialValue: boolean;
  apiFn: (newValue: boolean) => Promise<any>;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    const newValue = !value;
    setIsLoading(true);

    // Optimistically update
    setValue(newValue);

    try {
      const result = await apiFn(newValue);

      if (onSuccess) {
        onSuccess(result);
      }

      setIsLoading(false);
    } catch (error) {
      // Revert on error
      setValue(value);
      toast.error('Failed to update');

      if (onError) {
        onError(error as Error);
      }

      setIsLoading(false);
    }
  }, [value, apiFn, onSuccess, onError]);

  return { value, toggle, isLoading, setValue };
}
