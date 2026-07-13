import { readProjectFile, writeProjectFile } from "./files.js";

const CONFIG_FILE = "userscript.config.json";

export async function loadConfig() {

    try {

        const content = await readProjectFile(CONFIG_FILE);

        return JSON.parse(content);

    } catch {

        throw new Error(
            `Configuration file not found: ${CONFIG_FILE}`
        );

    }

}

export async function saveConfig(config) {

    await writeProjectFile(
        CONFIG_FILE,
        JSON.stringify(config, null, 2)
    );

}