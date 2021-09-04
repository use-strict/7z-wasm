var path = require("path");
var SevenZip = require("./7zz.umd");
var readlineSync = require("readline-sync");

var buf;
var i = 0;

SevenZip({
    stdin: () => {
        if (!buf) {
            buf = readlineSync.question() + "\n";
        }
        if (i < buf.length) {
            return buf.charCodeAt(i++);
        }
        buf = void 0;
        i = 0;
        return null;
    },
    stdout: (charCode) => {
        if (charCode !== null) {
            process.stdout.write(String.fromCharCode(charCode));
        }
    },
	quit: (code) => {
        if (code) {
            process.exit(code);
        }
    }
}).then(sevenZip => {
    var cwd = process.cwd();
    var hostRoot = path.parse(cwd).root;
    var hostDir = path.relative(hostRoot, cwd).split(path.sep).join("/");
    var mountRoot = "/nodefs";
	sevenZip.FS.mkdir(mountRoot);
    sevenZip.FS.mount(sevenZip.NODEFS, { root: hostRoot }, mountRoot);
    sevenZip.FS.chdir(mountRoot + "/" + hostDir);

    var args = process.argv.slice(2);
    sevenZip.callMain(args);
}).catch(e => {
    console.error(e);
    process.exit(-1);
});
