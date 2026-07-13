import fs from "node:fs/promises";
import path from "node:path";

export function getCurrentFolder() {
    return process.cwd();
}

export function getCurrentFolderName() {

    const folder = getCurrentFolder();

    return path.basename(folder);
}

export async function isFolderEmpty(folder) {

    const files = await fs.readdir(folder);

    return files.length === 0;
}