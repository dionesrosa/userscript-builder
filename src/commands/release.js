import { loadConfig, saveConfig } from "../utils/config.js";
import { validateConfig } from "../utils/validator.js";
import { bumpVersion } from "../utils/version.js";
import build from "./build.js";

export function parseReleaseType(args) {
    const releaseType = args[0] || "patch";

    if (!["patch", "minor", "major"].includes(releaseType)) {
        throw new Error(
            "Use: usb release patch|minor|major"
        );
    }

    return releaseType;
}

export default async function release(args = []) {
    const releaseType = parseReleaseType(args);

    console.log("🚀 Comando release");
    console.log("🔧 Tipo:", releaseType);

    let config = await loadConfig();

    console.log("⚙️ Configurações carregadas");

    config = validateConfig(config);

    const newVersion = bumpVersion(config.version, releaseType);

    config.version = newVersion;

    await saveConfig(config);

    console.log("✅ Versão atualizada:", newVersion);
    console.log("");

    await build();
}
