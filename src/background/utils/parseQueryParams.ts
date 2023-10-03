export default (url: string): Record<string, string> => {
  // Return object containing all query params from URL where the keys are
  // the query param names and the values are the query param values.
  const u = new URL(url);

  const queryParams: Record<string, string> = {};

  u.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return queryParams;
};
