# Colander Companion

Collect web content as evidence for your Colander investigations.
This web-extension is part of [PTS Project](https://github.com/PiRogueToolSuite)
and is meant to work in combination with a [Colander server](https://github.com/PiRogueToolSuite/colander).

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
                      used to provide (at least) update.json
webpack.config.js   : compilation rules
```

## Thrid parties

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
  
## Side load on devices

### Firefox desktop

```
npx web-ext run -t firefox-desktop
```

### Firefox mobile

Prerequistes:
  - an android device
  - android firefox installed
  - adb tools installed on dev host computer


Connect you android device to the dev host computer.

Accept the USB debugging request on the device.


Check the USB connection by listing android devices:
```bash
$> adb devices -l
List of devices attached
123456ABCDE            device usb:1-2.3.4 product:foo model:BAR device:foobar transport_id:1

```

In android firefox, enable "Remote Debugging via USB" from Settings -> Developer Tools if it is not yet enabled.


Then, inject the extension on android device with:
```
npx web-ext run -t firefox-android --android-device=123456ABCDE
```


While the extension is running on the android device, launch the webpack tool in another terminal:
```
npm run dev
```
