import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortOption<K extends string> {
  value: K;
  label: string;
}

interface UseListSortOptions<T, K extends keyof T & string> {
  data: T[];
  sortOptions: SortOption<K>[];
  initialSortKey?: K;
  initialSortDirection?: SortDirection;
  emptyLastOnAscKeys?: K[];
}

const isEmptyValue = (value: unknown) => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'number') return Number.isNaN(value);
  return false;
};

const toComparableValue = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const asNumber = Number(trimmed);
    if (trimmed !== '' && Number.isFinite(asNumber)) return asNumber;
    return trimmed.toLowerCase();
  }

  return value;
};

export default function useListSort<
  T extends object,
  K extends keyof T & string,
>({
  data,
  sortOptions,
  initialSortKey,
  initialSortDirection = 'asc',
  emptyLastOnAscKeys = [],
}: UseListSortOptions<T, K>) {
  const defaultSortKey = initialSortKey ?? sortOptions[0]?.value;

  const [sortKey, setSortKey] = useState<K>(
    (defaultSortKey as K) ?? ('id' as K)
  );
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialSortDirection);

  const sortedData = useMemo(() => {
    const copied = [...data];

    copied.sort((a, b) => {
      const leftRaw = (a as any)[sortKey] as unknown;
      const rightRaw = (b as any)[sortKey] as unknown;

      if (sortDirection === 'asc' && emptyLastOnAscKeys.includes(sortKey)) {
        const leftEmpty = isEmptyValue(leftRaw);
        const rightEmpty = isEmptyValue(rightRaw);

        if (leftEmpty && !rightEmpty) return 1;
        if (!leftEmpty && rightEmpty) return -1;
      }

      const left = toComparableValue(leftRaw);
      const right = toComparableValue(rightRaw);

      if (typeof left === 'number' && typeof right === 'number') {
        return sortDirection === 'asc' ? left - right : right - left;
      }

      const leftText = String(left ?? '');
      const rightText = String(right ?? '');
      const compared = leftText.localeCompare(rightText, 'ko');

      return sortDirection === 'asc' ? compared : -compared;
    });

    return copied;
  }, [data, sortKey, sortDirection, emptyLastOnAscKeys]);

  return {
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    sortedData,
  };
}
