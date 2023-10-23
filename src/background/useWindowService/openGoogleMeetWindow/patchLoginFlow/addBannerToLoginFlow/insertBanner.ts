async (): Promise<void> => {
  // This file _MUST_ contain just one top level function to be
  // executed in the google meet window

  // If we try to set the innerHTML of an element, we get an error saying
  // that the string is not trusted. We can get around this by creating a
  // trusted type policy that allows us to create HTML from a string.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML
  const escapeHTMLPolicy = window.trustedTypes.createPolicy(`forceInner`, {
    createHTML: (toEscape: string) => {
      return toEscape;
    },
  });

  const screenShareStyles = document.createElement(`style`);
  screenShareStyles.innerHTML = escapeHTMLPolicy.createHTML(`
  .sign-in-flow-banner {
    background: #c4e0e7;
    position: absolute;
    top: 0px;
    width: 100%;
    z-index: 1;
  }

  .sign-in-flow-banner__container {
    display: flex;
    justify-content: center;
    padding: 30px;
  }

  .sign-in-flow-banner__content {
    display: flex;
    flex-grow: 1;
    justify-content: center;
  }

  .sign-in-flow-banner__header {
    font-weight: bold;
    margin-right: 40px;
  }

  .sign-in-flow-banner__corner {
    flex: 1;
  }

  .sign-in-flow-banner__close {
    cursor: pointer;
    text-align: end;
  }
  `);

  document.head.appendChild(screenShareStyles);

  const selectionElem = document.createElement(`div`);
  selectionElem.classList.add(`sign-in-flow-banner`);
  selectionElem.innerHTML = escapeHTMLPolicy.createHTML(`
    <div class="sign-in-flow-banner__container">
      <div class="sign-in-flow-banner__corner"></div>
      <div class="sign-in-flow-banner__content">
        <div class="sign-in-flow-banner__header">Connect Google Meet</div>
        <div>Sign in to your Google account to connect Google Meet and create / join meetings.</div>
      </div>
      <div class="sign-in-flow-banner__corner sign-in-flow-banner__close">X</div>
    </div>
`);

  document.body.appendChild(selectionElem);

  const closeBtn = document.querySelector(`.sign-in-flow-banner__close`);
  if (closeBtn) {
    closeBtn.addEventListener(`click`, () => {
      selectionElem.remove();
    });
  }
};
