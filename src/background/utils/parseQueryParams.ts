export default (url: string): Map<string, string> => {
  // Return object containing all query params from URL where the keys are
  // the query param names and the values are the query param values.
  const u = new URL(url);

  const queryParams = new Map<string, string>();

  u.searchParams.forEach((value, key) => {
    queryParams.set(key, value);
  });

  return queryParams;
};
