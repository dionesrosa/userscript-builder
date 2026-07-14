import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function createTempDir(prefix = "userscript-builder-") {
    return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function writeJson(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function runGit(args, cwd) {
    return execFileAsync("git", args, {
        cwd,
        windowsHide: true
    });
}
