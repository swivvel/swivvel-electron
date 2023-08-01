/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
const { ipcRenderer } = require(`electron`);

const refreshClickableElements = () => {
  // eslint-disable-next-line no-undef
  const notificationElems = document.querySelectorAll(`[data-notification]`);

  notificationElems.forEach((notificationElem) => {
    if (notificationElem.dataset.listeningForMouse) {
      return;
    }

    notificationElem.addEventListener(`mouseenter`, () => {
      ipcRenderer.invoke(`set-ignore-mouse-events`, false);
    });

    notificationElem.addEventListener(`mouseleave`, () => {
      ipcRenderer.invoke(`set-ignore-mouse-events`, true, { forward: true });
    });

    notificationElem.dataset.listeningForMouse = true;
  });
};

// eslint-disable-next-line no-undef
window.addEventListener(`DOMContentLoaded`, () => {
  refreshClickableElements();
});

// eslint-disable-next-line no-undef
window.addEventListener(`DOMNodeInserted`, () => {
  refreshClickableElements();
});
