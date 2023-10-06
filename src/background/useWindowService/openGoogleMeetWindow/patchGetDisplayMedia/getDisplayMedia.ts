import { ShareableMediaSource } from '../../../../types';

async (): Promise<MediaStream | void> => {
  // This file _MUST_ contain just one top level function to be used
  // as an event callback

  const sources: Array<ShareableMediaSource> =
    await window.electron.getDesktopSources();

  // If we try to set the innerHTML of an element, we get an error saying
  // that the string is not trusted. We can get around this by creating a
  // trusted type policy that allows us to create HTML from a string.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML
  const escapeHTMLPolicy = window.trustedTypes.createPolicy(`forceInner`, {
    createHTML: (toEscape: string) => {
      return toEscape;
    },
  });

  const getSelectedMediaId = new Promise(
    (resolve: (value: string) => void, reject) => {
      const swivvelGreen = `#1f8059`;

      const screenShareStyles = document.createElement(`style`);

      screenShareStyles.innerHTML = escapeHTMLPolicy.createHTML(`
      .desktop-capturer-selection__backdrop {
        align-items: center;
        background: rgba(30,30,30,.75);
        color: #fff;
        display: flex;
        height: 100vh;
        justify-content: center;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 10000000;
      }
      .desktop-capturer-selection__modal {
        background: #fff;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        max-height: 60%;
        min-height: 300px;
        width: 60%;
      }
      .desktop-capturer-selection__header {
        color: #000;
        font-size: 20px;
        padding: 20px 20px 0px;
      }
      .desktop-capturer-selection__body {
        height: calc(100% - 100px);
        max-height: calc(100% - 100px);
        overflow-y: auto;
      }
      .desktop-capturer-selection__footer {
        display: flex;
      }
      .desktop-capturer-selection__cancel-btn {
        background: #eee;
        border: 0;
        border-radius: 3px;
        cursor: pointer;
        flex: 1;
        font-size: 15px;
        padding: 10px;
        transition: background-color .15s;
      }
      .desktop-capturer-selection__confirm-btn {
        background: ${swivvelGreen};
        border: 0;
        border-radius: 3px;
        color: #fff;
        cursor: pointer;
        flex: 1;
        font-size: 15px;
        padding: 10px;
        transition: background-color .15s;

        &[disabled] {
          background: #eee;
          color: #000;
          cursor: not-allowed;
        }
      }
      .desktop-capturer-selection__list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        list-style: none;
        margin: 20px 50px;
        max-width: calc(100% - 100px);
        overflow: hidden;
        padding: 0;
      }
      .desktop-capturer-selection__item {
        display: flex;
        margin: 8px;
      }
      .desktop-capturer-selection__btn {
        align-items: stretch;
        background: #fff;
        border: 1px solid #a1a3a7;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 0;
        padding: 4px;
        text-align: left;
        transition: background-color .15s, box-shadow .15s;
        width: 200px;

        &.selected {
          border-color: ${swivvelGreen};
          border-width: 4px;
        }
      }
      .desktop-capturer-selection__btn:hover,
      .desktop-capturer-selection__btn:focus {
        border-color: ${swivvelGreen};
        border-width: 4px;
      }
      .desktop-capturer-selection__thumbnail {
        object-fit: cover;
        width: 100%;
      }
      .desktop-capturer-selection__name {
        margin: 6px 0 6px;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
    }`);
      document.head.appendChild(screenShareStyles);

      const selectionElem = document.createElement(`div`);
      selectionElem.classList.add(`desktop-capturer-selection__backdrop`);
      selectionElem.innerHTML = escapeHTMLPolicy.createHTML(`
        <div class="desktop-capturer-selection__modal">
          <div class="desktop-capturer-selection__header">
            Select a screen to share
          </div>
          <div class="desktop-capturer-selection__body">
            <ul class="desktop-capturer-selection__list">
            ${sources
              .map(({ id, name, thumbnailUrl }) => {
                return `
                  <li class="desktop-capturer-selection__item">
                    <button class="desktop-capturer-selection__btn" data-id="${id}" title="${name}">
                      <img class="desktop-capturer-selection__thumbnail" src="${thumbnailUrl}" />
                      <span class="desktop-capturer-selection__name">${name}</span>
                    </button>
                  </li>`;
              })
              .join(``)}
            </ul>
          </div>
          <div class="desktop-capturer-selection__footer">
            <button class="desktop-capturer-selection__cancel-btn">
              Cancel
            </button>
            <button class="desktop-capturer-selection__confirm-btn" disabled>
              Share
            </button>
          </div>
        </div>
    `);

      document.body.appendChild(selectionElem);

      let selectedMediaId: string | null = null;

      const allOptionElements = document.querySelectorAll(
        `.desktop-capturer-selection__btn`
      );

      const selectButton = document.querySelector(
        `.desktop-capturer-selection__confirm-btn`
      );

      selectButton?.addEventListener(`click`, () => {
        if (selectedMediaId) {
          resolve(selectedMediaId);
        } else {
          reject(new Error(`No media source selected`));
        }
        selectionElem.remove();
      });

      const cancelButton = document.querySelector(
        `.desktop-capturer-selection__cancel-btn`
      );

      cancelButton?.addEventListener(`click`, () => {
        reject(new Error(`User cancelled`));
        selectionElem.remove();
      });

      allOptionElements.forEach((button) => {
        button.addEventListener(`click`, async () => {
          const id = button.getAttribute(`data-id`);
          const source = sources.find((src) => {
            return src.id === id;
          });
          if (!source) {
            throw new Error(`Source with id ${id} does not exist`);
          }

          selectedMediaId = source.id;

          allOptionElements.forEach((b) => {
            b.classList.remove(`selected`);
          });

          button.classList.add(`selected`);

          if (selectButton) {
            selectButton.removeAttribute(`disabled`);
          }
        });
      });
    }
  );

  let selectedMediaId: string | null = null;

  try {
    selectedMediaId = await getSelectedMediaId;
  } catch (err) {
    return;
  }

  return window.navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: `desktop`,
        chromeMediaSourceId: selectedMediaId,
      },
    } as MediaTrackConstraints,
  });
};
