import { APP_NAME, VERSION } from "./constants.js";
import build from "./commands/build.js";

export async function run(args) {

    console.log(`🔨 ${APP_NAME} v${VERSION}`);
    console.log("");

    const command = args[0];

    switch (command) {

        case "build":
            await build();
            break;

        default:
            console.log("Commands:");
            console.log("  build");
            console.log("  init");
            console.log("  release");
    }

}