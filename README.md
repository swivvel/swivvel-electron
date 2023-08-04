# swivvel-electron

- [swivvel-electron](#swivvel-electron)
  - [Overview](#overview)
  - [Development](#development)
  - [Releasing](#releasing)

## Overview

Thin Electron wrapper around Swivvel web app. Four main components:

1. Main BrowserWindow - Displays the web app
2. Notifications BrowserWindow - A full-screen transparent window for rendering rich notifications
3. Tray - Persistent icon in system tray with menu for various actions
4. Auto-updater - Polls for new versions; notifies user and schedules an app relaunch when a new version is found

Uses [electron-log](https://github.com/megahertz/electron-log) for logging. Logs are written to the following locations:

- **Linux**: ~/.config/{app name}/logs/main.log
- **macOS**: ~/Library/Logs/{app name}/main.log
- **Windows**: %USERPROFILE%\AppData\Roaming\{app name}\logs\main.log

## Development

1. Set `ELECTRON_APP_DEV_URL` environment variable to URL of local Swivvel instance
2. Make sure your local Swivvel instance is running
3. Run `npm run dev`

## Releasing

1. Make sure all changes are committed or stashed and `git status` shows no changes and no untracked files
2. Update the version in package.json file (e.g. 1.2.3)
3. Commit that change (`git commit -am v1.2.3`)
4. Tag the commit (`git tag v1.2.3`)
5. Push the changes to GitHub (`git push && git push --tags`)
6. Monitor the `Build/release` GitHub Action. This uses [action-electron-builder](https://github.com/samuelmeuli/action-electron-builder) to build, sign, notarize and publish the app.
7. When the action is finished, a new draft release will appear on the [Releases](https://github.com/swivvel/swivvel-electron/releases) page
8. Edit the release and click "Publish" to make the release live
9. Clients will download the new version and notify users to restart the app (or automatically restart the app at midnight)
