import { BrowserWindow } from 'electron';

import { Log } from '../../utils';

export default async (window: BrowserWindow, log: Log): Promise<boolean> => {
  if (!window.webContents.getURL().includes(`https://meet.google.com/`)) {
    log(`User is not in a Google Meet (or its lobby)`);
    return false;
  }

  const clickedSignIn = await window.webContents.executeJavaScript(`
  (() => {
    const signInButton = [...document.querySelectorAll('[role="button"]')].find((button) => {
      return [...button.querySelectorAll('span')].find((span) => {
        return span.innerText.toLowerCase().includes('sign in');
      })
    }) || null;

    if (signInButton) {
      signInButton.click();
    }

    return Boolean(signInButton);
  })();
  `);

  if (clickedSignIn) {
    log(`Clicked sign in button`);
  }

  return clickedSignIn;
};
