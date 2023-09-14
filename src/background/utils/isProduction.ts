import { app } from 'electron';

export default (): boolean => {
  return app.isPackaged;
};
