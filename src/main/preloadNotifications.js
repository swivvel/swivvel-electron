/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
const { ipcRenderer } = require(`electron`);

console.log(`preloadNotifications`);

const refreshClickableElements = () => {
  // eslint-disable-next-line no-undef
  const notificationsElem = document.querySelector(`[data-notifications]`);

  if (!notificationsElem || notificationsElem.dataset.listeningForMouse) {
    return;
  }

  console.log(`refreshClickableElements`);
  console.log(notificationsElem);

  notificationsElem.addEventListener(`mouseenter`, () => {
    console.log(`mouseenter`);
    ipcRenderer.invoke(`set-ignore-mouse-events`, false);
  });

  notificationsElem.addEventListener(`mouseleave`, () => {
    console.log(`mouseleave`);
    ipcRenderer.invoke(`set-ignore-mouse-events`, true, { forward: true });
  });

  notificationsElem.dataset.listeningForMouse = true;
};

// eslint-disable-next-line no-undef
window.addEventListener(`DOMContentLoaded`, () => {
  refreshClickableElements();
});

// eslint-disable-next-line no-undef
window.addEventListener(`DOMNodeInserted`, () => {
  refreshClickableElements();
});
