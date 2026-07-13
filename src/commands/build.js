import { readProjectFile, writeProjectFile } from "../utils/files.js";
import { loadConfig } from "../utils/config.js";
import { validateConfig } from "../utils/validator.js";
import { generateMetadata } from "../utils/metadata.js";
import { generateScript } from "../utils/template.js";
import { getOutputFile } from "../utils/output.js";

export default async function build() {

    let config = await loadConfig();

    console.log("⚙️ Config loaded");

    config = validateConfig(config);

    console.log("✅ Config validated");

    console.log("");
    console.log("📦 Project:", config.name);
    console.log("🔖 Version:", config.version);
    console.log("");

    const script = await readProjectFile(config.entry);

    console.log("📄 Entry:", config.entry);

    const metadata = generateMetadata(config);

    console.log("📝 Metadata generated");

    const output = generateScript(metadata, script);

    console.log("🛠️ Script generated");

    const outputFile = getOutputFile(config);

    await writeProjectFile(outputFile, output);

    console.log("");
    console.log("✅ Build completed!");
    console.log("📁 Output:", outputFile);
}