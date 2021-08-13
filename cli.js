var path = require("path");
var SevenZip = require("./7zz.umd");

SevenZip({
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
