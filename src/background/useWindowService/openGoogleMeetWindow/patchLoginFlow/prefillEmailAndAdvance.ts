import { BrowserWindow } from 'electron';

import { Log } from '../../utils';

export default async (window: BrowserWindow, log: Log): Promise<boolean> => {
  if (!window.webContents.getURL().includes(`https://accounts.google.com/`)) {
    log(`User is not in the login flow, cannot prefill email`);
    return false;
  }

  const email = `eric@swivvel.io`;

  const prefilled = await window.webContents.executeJavaScript(`
  (() => {
    const emailInput = document.querySelector('input[type="email"]');

    if (emailInput) {
      emailInput.value = '${email}';
      // Remove siblings of email input to get rid of placeholder text
      [...emailInput.parentElement.children].forEach((child) => {
        if (child !== emailInput) {
          child.remove()
        }
      })
    }

    return Boolean(emailInput);
  })();
  `);

  if (prefilled) {
    log(`Prefilled email`);
  } else {
    log(`Could not find email input`);
    return false;
  }

  const advanced = await window.webContents.executeJavaScript(`
  (() => {
    const nextButton = document.querySelector('#identifierNext');

    if (nextButton) {
      nextButton.click()
    }

    return Boolean(nextButton);
  })();
  `);

  return advanced;
};
