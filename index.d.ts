export interface SevenZipModuleFactory {
    (opts?: Partial<SevenZipModuleOptions>): Promise<SevenZipModule>;
}

export interface SevenZipModuleOptions {
    noFSInit: boolean;
    stdin(): number;
    stdout(charCode: number): void;
    stderr(charCode: number): void;

    preInit: Array<{ (): void }>;
    preRun: Array<{ (): void }>;
    postRun: Array<{ (): void }>;

    locateFile(url: string, scriptDirectory: string): string;
    print(str: string): void;
    printErr(str: string): void;
    quit(code: number, exitStatus: ExitStatus): void;
    onAbort(what: string | number): void;
    onExit(code: number): void;
    onRuntimeInitialized(): void;
    noExitRuntime: boolean;
    logReadFiles: boolean;
    wasmBinary: ArrayBuffer;
}

export interface ExitStatus {
    name: string;
    message: string;
    status: number;
}

export interface SevenZipModule {
    FS: FileSystem;
    NODEFS: FileSystem;
    WORKERFS: FileSystem;
    callMain(args: string[]): void;
}

export interface FileSystem {
    //
    // paths
    //
    lookupPath(path: string, opts?: FSLookupOpts): FSLookup;
    getPath(node: FSNode): string;

    //
    // nodes
    //
    isFile(mode: number): boolean;
    isDir(mode: number): boolean;
    isLink(mode: number): boolean;
    isChrdev(mode: number): boolean;
    isBlkdev(mode: number): boolean;
    isFIFO(mode: number): boolean;
    isSocket(mode: number): boolean;

    //
    // devices
    //
    major(dev: number): number;
    minor(dev: number): number;
    makedev(ma: number, mi: number): number;
    registerDevice(dev: number, ops: any): void;

    //
    // core
    //
    syncfs(populate: boolean, callback: (e: number | null) => void): void;
    syncfs(callback: (e: number | null) => void, populate?: boolean): void;
    mount(type: FileSystem, opts: any, mountpoint: string): FSNode;
    unmount(mountpoint: string): void;

    mkdir(path: string, mode?: number): FSNode;
    mkdev(path: string, mode?: number, dev?: number): FSNode;
    symlink(oldpath: string, newpath: string): FSNode;
    rename(old_path: string, new_path: string): void;
    rmdir(path: string): void;
    readdir(path: string): string[];
    unlink(path: string): void;
    readlink(path: string): string;
    stat(path: string, dontFollow?: boolean): FSNodeAttr;
    lstat(path: string): FSNodeAttr;
    chmod(path: string, mode: number, dontFollow?: boolean): void;
    lchmod(path: string, mode: number): void;
    fchmod(fd: number, mode: number): void;
    chown(path: string, uid: number, gid: number, dontFollow?: boolean): void;
    lchown(path: string, uid: number, gid: number): void;
    fchown(fd: number, uid: number, gid: number): void;
    truncate(path: string, len: number): void;
    ftruncate(fd: number, len: number): void;
    utime(path: string, atime: number, mtime: number): void;
    open(path: string, flags: string, mode?: number, fd_start?: number, fd_end?: number): FSStream;
    close(stream: FSStream): void;
    llseek(stream: FSStream, offset: number, whence: number): number;
    read(stream: FSStream, buffer: ArrayBufferView, offset: number, length: number, position?: number): number;
    write(
        stream: FSStream,
        buffer: ArrayBufferView,
        offset: number,
        length: number,
        position?: number,
        canOwn?: boolean,
    ): number;
    allocate(stream: FSStream, offset: number, length: number): void;
    mmap(
        stream: FSStream,
        buffer: ArrayBufferView,
        offset: number,
        length: number,
        position: number,
        prot: number,
        flags: number,
    ): any;
    readFile(path: string, opts: { encoding: 'binary'; flags?: string | undefined }): Uint8Array;
    readFile(path: string, opts: { encoding: 'utf8'; flags?: string | undefined }): string;
    readFile(path: string, opts?: { flags?: string | undefined }): Uint8Array;
    writeFile(path: string, data: string | ArrayBufferView, opts?: { flags?: string | undefined }): void;

    //
    // module-level FS code
    //
    cwd(): string;
    chdir(path: string): void;
    init(
        input?: null | (() => number | null),
        output?: null | ((c: number) => any),
        error?: null | ((c: number) => any),
    ): void;

    createLazyFile(
        parent: string | FSNode,
        name: string,
        url: string,
        canRead: boolean,
        canWrite: boolean,
    ): FSNode;
    createPreloadedFile(
        parent: string | FSNode,
        name: string,
        url: string,
        canRead: boolean,
        canWrite: boolean,
        onload?: () => void,
        onerror?: () => void,
        dontCreateFile?: boolean,
        canOwn?: boolean,
    ): void;
    createDataFile(
        parent: string | FSNode,
        name: string,
        data: ArrayBufferView,
        canRead: boolean,
        canWrite: boolean,
        canOwn: boolean,
    ): FSNode;
}

export interface FSLookupOpts {
    follow?: boolean;
    follow_mount?: boolean;
    parent?: boolean;
}

export interface FSLookup {
    path: string;
    node: FSNode;
}

export interface FSStream {
    object: FSNode;
    isRead: boolean;
    isWrite: boolean;
    isAppend: boolean;
}
export interface FSNode {
    contents: Record<string, FSNode>;
    id: number;
    mode: number;
    mount: unknown;
    name: string;
    parent: FSNode | undefined;
    rdev: number;
    timestamp: number;
    isDevice(): boolean;
    isFolder(): boolean;
    read: boolean;
    write: boolean;
}

export interface FSNodeAttr {
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: unknown;
    size: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    blksize: number;
    blocks: number;
}

declare const factory: SevenZipModuleFactory;
export default factory;
