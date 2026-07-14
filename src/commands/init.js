import { saveConfig } from "../utils/config.js";
import { getCurrentFolder, isFolderEmpty } from "../utils/folder.js";
import { ask, closePrompt } from "../utils/prompt.js";
import { collectProjectConfig, collectAdvancedConfig } from "../utils/setup.js";
import { generateConfig } from "../utils/config-template.js";
import { generateEntryScript } from "../utils/script-template.js";
import { writeProjectFile } from "../utils/files.js";

export function parseInitArgs(args) {
    return {
        yes: args.includes("--yes") || args.includes("-y")
    };
}

export function buildDefaultAnswers(folder) {
    return {
        name: folder.split(/[\\/]/).pop() || "userscript",
        version: "1.0.0",
        description: "UserScript gerado com userscript-builder",
        author: "Anonymous",
        match: ["*://*/*"]
    };
}

export default async function init(args = []) {
    const options = parseInitArgs(args);

    try {

        console.log("🚀 Comando init");

        const folder = getCurrentFolder();

        console.log("📁 Pasta Atual:", folder);

        const empty = await isFolderEmpty(folder);

        if (!empty) {

            console.log("⚠️ A pasta não está vazia. Alguns arquivos podem ser sobrescritos.");

            if (!options.yes) {
                const answer = await ask("Deseja criar o projeto nesta pasta? (s/n)");

                if (answer.toLowerCase() !== "s") {
                    console.log("❌ Criação do projeto cancelada.");
                    return;
                }

            } else {
                console.log("✅ Modo não interativo ativado. Continuando.");
            }

        } else {

            console.log("✅ Pasta vazia. Pronta para criar projeto.");

        }


        const answers = options.yes
            ? buildDefaultAnswers(folder)
            : await collectProjectConfig();


        if (!options.yes) {
            const advanced = await ask(
                "Configurações avançadas? (s/n)"
            );

            if (advanced.toLowerCase() === "s") {
                const advancedConfig = await collectAdvancedConfig();

                Object.assign(
                    answers,
                    advancedConfig
                );
            }
        }


        const projectConfig = generateConfig(answers);


        console.log("");

        console.log("💾 Criando userscript.config.json...");

        await saveConfig(projectConfig);

        console.log("✅ Configuração criada.");

        console.log("📁 Criando estrutura do projeto...");
        console.log("📄 Criando " + projectConfig.entry + "...");

        const entryScript = generateEntryScript();

        await writeProjectFile(
            projectConfig.entry,
            entryScript
        );

        console.log("✅ Arquivo criado:", projectConfig.entry);

    } finally {

        closePrompt();

    }

}
