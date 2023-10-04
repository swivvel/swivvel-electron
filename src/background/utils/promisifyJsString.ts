export default (js: string): string => {
  return `new Promise((resolve, reject) => { resolve(${js}); });`;
}