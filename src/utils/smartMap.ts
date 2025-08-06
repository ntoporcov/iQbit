import { ReactNode } from "react";

type smartMapCallbackParams<T> = (
  item: T,
  {
    index,
    isFirst,
    isLast,
    isMiddle,
    prevItem,
  }: {
    index: number;
    isFirst: boolean;
    isLast: boolean;
    isMiddle: boolean;
    prevItem?: T;
    nextItem?: T;
  },
  array: T[]
) => ReactNode;

export function smartMap<T>(arr: T[], callback: smartMapCallbackParams<T>) {
  return arr.map((item, index, array) => {
    return callback(
      item,
      {
        index,
        isFirst: index === 0,
        isMiddle: index === array.length / 2,
        isLast: index === array.length - 1,
        prevItem: array?.[index - 1],
        nextItem: array?.[index + 1],
      },
      array
    );
  });
}
