import { loadConfig } from "../utils/config.js";
import { validateConfig } from "../utils/validator.js";

export default async function build() {

    const config = await loadConfig();

    validateConfig(config);

    console.log("📦 Project:", config.name);
    console.log("🔖 Version:", config.version);

}