export default (url: string): string => {
  return url.split(`?`)[0];
};
