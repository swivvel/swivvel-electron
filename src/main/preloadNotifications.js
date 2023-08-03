const { contextBridge, ipcRenderer } = require(`electron`);

const isLinux = process.platform === `linux`;

contextBridge.exposeInMainWorld(`electron`, {
  isLinux,
});

const makeElementClickable = (element) => {
  if (element.dataset.hasMouseEnter) {
    return;
  }

  element.addEventListener(`mouseenter`, () => {
    ipcRenderer.invoke(`set-ignore-mouse-events`, false);
  });

  element.addEventListener(`mouseleave`, () => {
    ipcRenderer.invoke(`set-ignore-mouse-events`, true);
  });

  element.dataset.hasMouseEnter = `true`;
};

if (!isLinux) {
  // eslint-disable-next-line no-undef
  window.addEventListener(`DOMNodeInserted`, (event) => {
    // eslint-disable-next-line no-undef
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (
      [`NEXT-ROUTE-ANNOUNCER`, `SCRIPT`, `STYLE`].includes(event.target.tagName)
    ) {
      return;
    }

    makeElementClickable(event.target);
  });
}
