export function getPrimaryId(element: any): string | undefined {
  // Return the first property ending with _id that is a string.
  for (const key in element) {
    if (/_id$/.test(key) && typeof element[key] === "string") {
      return element[key];
    }
  }
  return undefined;
}
