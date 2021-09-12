# 7-Zip WASM

7-Zip compiled to WASM with emscripten. Based on 7-Zip 21.03 beta (2021-07-20).

- Runs in any JavaScript environment that supports WASM (Browser or NodeJS)
- Supports all file formats that the full `7zz` CLI supports.
- Only Emscripten NODEFS and WORKERFS adapters are included by default.

Inspired by https://github.com/sonictruth/7zip.js

## Usage

### Command-line

```
npx 7z-wasm --help
```

or

```
npm i -g 7z-wasm
7z-wasm --help
```

### As a module

```ts
import SevenZip from "7z-wasm";

const sevenZip = await SevenZip();

const archiveData = new Uint8Array(100);
const archiveName = "archive.7z";

const stream = sevenZip.FS.open(archiveName, "w+");
sevenZip.FS.write(stream, archiveData, 0, archiveData.length);
sevenZip.FS.close(stream);

const filesToExtract = ["some-file.txt"];
sevenZip.callMain(["x", archiveName, ...filesToExtract]);
console.log(sevenZip.FS.readFile(filesToExtract[0]));
```

### Working with the real file system (Node.JS only)

```ts
import SevenZip from "7z-wasm";

const mountRoot = "/nodefs";
sevenZip.FS.mkdir(mountRoot);
sevenZip.FS.mount(sevenZip.NODEFS, { root: "/real/root/folder" }, mountRoot);
sevenZip.FS.chdir(mountRoot + "/subfolder");

sevenZip.callMain(["x", "archive.7z", "some-file.txt"]);
```

## Building

Because the 7-Zip sources are not available on GitHub, the build process relies on downloading the sources from the
7-Zip website and patching them so they compile with emcc.

- Install docker
- Execute `./build` (or `.\build`, respectively, on Windows CMD)

You can pass custom options to emcc via env file (e.g. see [build-umd.env]())
