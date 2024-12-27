export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function popRandomItem<T>(items: T[]) {
  if (items.length === 0) {
    return undefined;
  }
  const lastIndex = items.length - 1;
  const randomIdx = getRandomInt(0, lastIndex);

  const chosen = items[randomIdx];
  const prev = items[lastIndex];
  items[lastIndex] = chosen;
  items[randomIdx] = prev;
  return items.pop();
}

export function randomisedArray<T>(array: T[]): T[] {
  const cloned: T[] = [...array];
  const target: T[] = [];

  while (target.length !== array.length) {
    const item = popRandomItem(cloned);
    if (!item) {
      break;
    }
    target.push(item);
  }

  return target;
}