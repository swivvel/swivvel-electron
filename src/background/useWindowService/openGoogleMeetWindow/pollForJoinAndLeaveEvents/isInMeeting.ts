import { BrowserWindow } from "electron";

export default async (
  googleMeetWindow: BrowserWindow,
): Promise<boolean> =>{

  const isInMeeting = await googleMeetWindow.webContents.executeJavaScript(
    `new Promise((resolve, reject) => {
      const isInMeeting = document.querySelector('[aria-label="Leave call"]') !== null;
      resolve(isInMeeting);
    });`,
  );

  return isInMeeting;
}
