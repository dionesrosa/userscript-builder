import { loadConfig, saveConfig } from "../utils/config.js";
import { validateConfig } from "../utils/validator.js";
import { addAllAndCommit } from "../utils/git.js";
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
    console.log("🔧 Tipo de release:", releaseType);

    let config = await loadConfig();

    console.log("⚙️ Configurações carregadas");

    config = validateConfig(config);

    const newVersion = bumpVersion(config.version, releaseType);

    config.version = newVersion;

    await saveConfig(config);

    console.log("✅ Versão atualizada para:", newVersion);
    console.log("");

    await build();

    const commitMessage = `chore(release): atualizar versão para ${newVersion}`;

    try {
        await addAllAndCommit(commitMessage);
        console.log("✅ Commit criado no Git:", commitMessage);
    } catch (error) {
        if (error.message?.includes("nothing to commit")) {
            console.log("ℹ️ Nenhuma alteração para commitar após o build.");
            return;
        }

        throw error;
    }
}
