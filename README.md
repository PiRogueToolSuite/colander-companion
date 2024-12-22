# Colander Companion

Collect web content as evidence for your Colander investigations.
This web-extension is part of [PTS Project](https://github.com/PiRogueToolSuite)
and is meant to work in combination with a [Colander server](https://github.com/PiRogueToolSuite/colander).

# Supported browsers
- Firefox desktop ( v133+ )
- Firefox Android ( v133+ )
  
## To be confirmed
- Chrome (with side loaded extension)

## Untested
- Safari

## Known limitation
- Video tag thumbnail are renderer as black box on android devices

# Development
## Project structure
```
app/
  lib/              : third parties dependencies
  scripts/          : colander companion compiled scripts
  [...]
  manifest.json     : web extension manifest
src/                : colander companion sources
                      (those compiled to app/scripts)
docs/               : github root page
                      used to provide (at least) updates.json
webpack.config.js   : compilation rules
```

## Third parties

This web-extension mainly relies on SingleFile extension.

* [SingleFile extension repository](https://github.com/gildas-lormeau/SingleFile)
* [SingleFile Manifest V3 version repository](https://github.com/gildas-lormeau/SingleFile-MV3)

### SingleFile dependencies
* single-file.js
* single-file-background.js
* single-file-bootstrap.js
* single-file-extension-core.js
* single-file-extension-frames.js
* single-file-frames.js
* single-file-hooks-frames.js
* single-file-zip.min.js
* single-file-z-worker.js

## Development

While the extension is running on desktop browser or Android device,
launch the webpack tool in a terminal:
```
npm run dev
```

You will need another detached terminal to side load the extension.

## Side load on devices
### Firefox desktop
```
npx web-ext run -t firefox-desktop
```

### Firefox mobile
Requirements:
- an Android device
- Firefox for Android is already installed
- `adb` is already installed on the dev host computer

Connect your Android device to the dev host computer.

Accept the USB debugging request on the device.

Check the USB connection by listing Android devices:
```bash
$> adb devices -l
List of devices attached
123456ABCDE            device usb:1-2.3.4 product:foo model:BAR device:foobar transport_id:1
```

With Firefox for Android, enable *Remote Debugging via USB* from *Settings -> Developer Tools* if it's not enabled yet.

Then, inject the extension on Android device with:
```
npx web-ext run -t firefox-android --android-device=123456ABCDE
```

## Editing the 'Colander Companion' GitHub page

Running the following target starts a temporary web-server.
```
npm run page-dev
```

It serves `docs` folder content (allowing JS `fetch()` to work).
