import build from "./commands/build.js";

export async function run(args) {

    const command = args[0];

    switch (command) {

        case "build":
            await build();
            break;

        default:
            console.log("User Script Builder");
            console.log("");
            console.log("Commands:");
            console.log("  build");
            console.log("  init");
            console.log("  release");
    }

}