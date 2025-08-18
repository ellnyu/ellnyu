type PlainObject = Record<string, unknown>;

export function snakeToCamel<T extends PlainObject | unknown[]>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) => snakeToCamel(item as PlainObject | unknown[])) as T;
  } else if (isPlainObject(input)) {
    const result: PlainObject = {};
    for (const key in input) {
      const value = input[key];
      const camelKey = key.replace(/([-_][a-z])/gi, (match) =>
        match.toUpperCase().replace("_", "").replace("-", "")
      );
      result[camelKey] = snakeToCamel(value as PlainObject | unknown[]);
    }
    return result as T;
  }
  return input;
}

export function camelToSnake<T extends PlainObject | unknown[]>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) => camelToSnake(item as PlainObject | unknown[])) as T;
  } else if (isPlainObject(input)) {
    const result: PlainObject = {};
    for (const key in input) {
      const value = input[key];
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      result[snakeKey] = camelToSnake(value as PlainObject | unknown[]);
    }
    return result as T;
  }
  return input;
}

function isPlainObject(value: unknown): value is PlainObject {
  return Object.prototype.toString.call(value) === "[object Object]";
}

