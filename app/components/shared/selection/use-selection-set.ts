'use client';

import { useCallback, useMemo, useState } from 'react';

/**
 * Shared selection helper for "bulk actions" UIs.
 * Keeps selection logic consistent across domains.
 */
export function useSelectionSet<TId extends string>(allIds: TId[]) {
  const [selected, setSelected] = useState<Set<TId>>(new Set());

  const selectedCount = selected.size;
  const totalCount = allIds.length;
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  const clear = useCallback(() => setSelected(new Set()), []);

  const toggleOne = useCallback((id: TId, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      setSelected(checked ? new Set(allIds) : new Set());
    },
    [allIds]
  );

  return {
    selected,
    selectedIds,
    selectedCount,
    totalCount,
    isAllSelected,
    setSelected,
    clear,
    toggleOne,
    toggleAll,
  };
}

