UI Inspector for iOS DeviceAgent
====================

Tool for inspecting UI elements in iOS application instrumented with [DeviceAgent.iOS](https://github.com/calabash/DeviceAgent.iOS).

![Inspector Screenshot](https://raw.githubusercontent.com/badoo/DeviceAgent.iOS.Inspector/master/screenshot.png)

Inspector is based on the original sources of [Inspector for WebDriverAgent](https://github.com/appium/WebDriverAgent/tree/fb77c4471bd679aa9bdc2ad5cfd1fd552dcf3ae5/Inspector) ([created by Facebook](https://github.com/facebookarchive/WebDriverAgent/tree/master/Inspector) and [now maintaned by Appium](https://github.com/appium/WebDriverAgent))


Build
-----

Run following commands in terminal:
```
npm install
npm run build
```

Output will be file `inspector.js`


Usage
-----

1. While executing iOS tests using [Calabash DeviceAgent](https://github.com/calabash/DeviceAgent.iOS), set a breakpoint for to investigating UI elements tree.
2. Open in your browser web page `index.html`
(by default it will connect to DeviceAgent's port http://localhost:27753)

License
-----

[`UI Inspector for iOS DeviceAgent` is BSD-licensed](LICENSE).
