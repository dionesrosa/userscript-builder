import { ask } from "./prompt.js";
import { getCurrentFolderName } from "./folder.js";

export async function collectProjectConfig() {

    console.log("");
    console.log("📝 Configuração do projeto");
    console.log("");

    const config = {};

    const folderName = getCurrentFolderName();

    config.name = await ask("Nome do projeto", folderName);
    config.version = await ask("Versão", "1.0.0");
    config.description = await ask("Descrição");
    config.author = await ask("Autor");

    return config;
}