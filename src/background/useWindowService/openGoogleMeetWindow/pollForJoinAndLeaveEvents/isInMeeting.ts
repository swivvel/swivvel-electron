import { BrowserWindow } from "electron";

export default async (
  googleMeetWindow: BrowserWindow,
): Promise<boolean> =>{

  const isInMeeting = await googleMeetWindow.webContents.executeJavaScript(
    `document.querySelector('[aria-label="Leave call"]') !== null;`,
  );

  return isInMeeting;
}
