/**
 * Pause execution for the given number of milliseconds.
 */
export default (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
