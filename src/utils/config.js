import fs from "node:fs/promises";
import path from "node:path";

const CONFIG_FILE = "userscript.config.json";

export async function loadConfig() {

    const configPath = path.join(
        process.cwd(),
        CONFIG_FILE
    );

    try {

        const content = await fs.readFile(
            configPath,
            "utf-8"
        );

        return JSON.parse(content);

    } catch (error) {

        throw new Error(
            `Configuration file not found: ${CONFIG_FILE}`
        );

    }

}