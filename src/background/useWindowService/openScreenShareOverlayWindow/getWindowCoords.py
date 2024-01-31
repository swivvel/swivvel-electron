import sys
import json
import pygetwindow as getWindow

requestedWindowName = sys.stdin.readline().strip()


# targetWindow = getWindow.getWindowGeometry(requestedWindowName)
targetWindow = getWindow.getActiveWindow()
windowGeometry = getWindow.getWindowGeometry(targetWindow)
# windowGeometry = getWindow.getWindowGeometry(targetWindow)

data = {
    "x": windowGeometry[0],
    "y": windowGeometry[1],
    "width": windowGeometry[2],
    "height": windowGeometry[3]
}

# We will listen for a message from the node app to move the window
# when we print this message
print(json.dumps(data))