import { BrowserWindow, desktopCapturer } from 'electron';
import log from 'electron-log';

const promisify = (fnString: string): string =>  {
    return  `new Promise((resolve, reject) => { resolve(${fnString}); });`
}

const clickNewMtg = `
[...document.querySelectorAll("span")]
.filter(span => span.textContent.includes("New meeting"))
.forEach(span => span.closest("button").click())
`

const clickInstantMtg = `
[...document.querySelectorAll("span")]
.filter(span => span.textContent.includes("Start an instant meeting"))
.forEach(span => span.click())
`

const participants = `
[...document.querySelectorAll('[data-participant-id]')].map((part) => {
  return part.children[1].children[0].children[0]
})
`


const getContents = `document.documentElement.innerHTML`
// console.log(`contents`, testWindow.webContents.executeJavaScript(`function gethtml () {
    //     return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
    //     }
    //     gethtml();`).then((html) => {
        //     console.log(html)
        //   }));

/**
 * Tell the web app when the user is idle.
 */
export default (testWindow: BrowserWindow): void => {
  log.info(`Configuring idle time polling...`);

  let isIdle = false;

  const meetingIdRegex = /https:\/\/meet.google.com\/([a-z]{3}-[a-z]{4}-[a-z]{3})/g

  const interval = setInterval(async () => {
    if (testWindow.isDestroyed()) {
      clearInterval(interval);
      return;
    }

    // const title = testWindow.webContents.getTitle();
    // const url = testWindow.webContents.getURL();
    // const contents = await testWindow.webContents.executeJavaScript(getContents);
    // if (url === `https://meet.google.com/`){
    //   await testWindow.webContents.executeJavaScript(promisify(clickNewMtg))
    //   await testWindow.webContents.executeJavaScript(promisify(clickInstantMtg))
    // }

    // const meetingIdMatch = url.match(meetingIdRegex);
    // if (meetingIdMatch) {
    //   const meetingId = url.split(`/`)[3];

    //   console.log(`meeting id`, meetingId)

    //   const parts = await testWindow.webContents.executeJavaScript(promisify(participants));

    //   console.log(`participants`, parts)
    // }

    // log.info(`------------`);
    // const sources = await desktopCapturer.getSources({
    //   types: [`window`, `screen`],
    // });
    // log.info(`------------`);

    // sources.forEach(async (source) => {
    //   if (source.name === `Google Chrome`) {
    //     log.info(`source`, source);
    //     const huh = await testWindow.webContents.executeJavaScript(`
    //     navigator.getUserMedia({
    //       audio: false,
    //       video: {
    //         mandatory: {
    //           chromeMediaSource: 'desktop',
    //           chromeMediaSourceId: 'window:183:0',
    //         },
    //       }
    //     },
    //     (y) => {console.log('yay', y)},
    //     (n) => {console.log('nay', n)})
    //     `)


    //     navigator.mediaDevices.getUserMedia
    //     console.log(`huh`, huh)



    //   }
    // })

    // log.info(JSON.stringify(sources, null, 2));
    // log.info(`------------`);


  }, 1000);

  log.info(`Configured idle time polling`);
};


// [...document.querySelectorAll("span")]
//    .filter(span => span.textContent.includes("New meeting"))
//    .forEach(span => span.closest("button").click())