// @ts-check
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const crypto = require("crypto");
const assert = require("assert");

function getRecursiveFilesList(dir) {
  const filesList = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isDirectory()) {
      // Recursively call the function for subdirectories
      filesList.push(...getRecursiveFilesList(filePath));
    } else {
      filesList.push(filePath);
    }
  });

  return filesList;
}

function chmodr(dir, mode) {
    for (const entry of fs.readdirSync(dir)) {
        const subpath = path.join(dir, entry);
        const stats = fs.statSync(subpath);

        fs.chmodSync(subpath, mode);

        if (stats.isDirectory()) {
            chmodr(subpath, mode);
        }
    }
}

async function computeChecksum(filePath) {
    const stream = fs.createReadStream(filePath);
    const hash = crypto.createHash("sha256");
    return new Promise((resolve, reject) => {
        stream.on("error", err => reject(err));
        stream.on("data", chunk => hash.update(chunk));
        stream.on("end", () => resolve(hash.digest("hex")));
    });
}

const baseDir = path.resolve(__dirname, "..");
function run7z(args) {
    return child_process.spawnSync("node", [path.join(baseDir, "cli.js"), ...args], {
        cwd: baseDir,
        timeout: 5000
    });
}

const testFilesDir = path.join(__dirname, "test-files");
const testArchives = getRecursiveFilesList(testFilesDir).map(filePath => path.relative(baseDir, filePath));

const outDir = path.join(baseDir, "test/out");

const checksums = new Map([
    [".gitignore", "d1e8d4fa856e17b2ad54a216aae527a880873df76cc30a85d6ba6b32d2ee23cc"],
    ["README.md", "b4555fd8dd6e81599625c1232e58d5e09fc36f3f6614bf792a6978b30cfe65bb"],
    ["addon/addon.py", "e0ab20fe5fd7ab5c2b38511d81d93b9cb6246e300d0893face50e8a5b9485b90"],
    ["addon/addon.xml", "d26a8bdf02e7ab2eaeadf2ab603a1d11b2a5bfe57a6ac672d1a1c4940958eba8"],
    ["test.tar", "bc8e1271a9ee88fdd09df396763df031e15f7af7906074a0dc83d908085f7fed"]
]);

describe("cli", () => {
    for (const testArchive of testArchives) {
        it(`should extract ${testArchive} archive`, async () => {
            const result = run7z(["x", `-o${path.relative(baseDir, outDir)}`, "-pnika", "-y", testArchive]);
            assert.equal(result.status, 0, `Process exited with non-zero code.\nStderr: ${result.stderr}`);

            const outFiles = getRecursiveFilesList(outDir).map(filePath => path.relative(outDir, filePath));
            assert.notEqual(outFiles.length, 0);
            assert.equal(outFiles.length, testArchive.includes(".tar.") ? 1 : 4);

            for (const filePath of outFiles) {
                assert.deepEqual(
                    [filePath, await computeChecksum(path.join(outDir, filePath.replace("/", path.sep)))],
                    [filePath, checksums.get(filePath)]
                );
            }
        });
    }

    afterEach(() => {
        if (fs.existsSync(outDir)) {
            chmodr(outDir, 0o700);
            fs.rmSync(outDir, { recursive: true, force: true });
        }
    });
});