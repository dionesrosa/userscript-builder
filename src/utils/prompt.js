import readline from "node:readline";
import readlinePromises from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

let rl;

function getPrompt() {

    if (!rl) {
        rl = readlinePromises.createInterface({
            input,
            output
        });
    }

    return rl;
}

export async function ask(question, defaultValue = "") {

    const prompt = getPrompt();

    const suffix = defaultValue
        ? ` (${defaultValue})`
        : "";

    const answer = await prompt.question(`${question}${suffix}: `);

    const value = answer.trim() || defaultValue;

    readline.moveCursor(output, 0, -1);
    readline.clearLine(output, 0);
    readline.cursorTo(output, 0);

    output.write(`${question}: ${value}\n`);

    return value;
}

export function closePrompt() {

    if (rl) {
        rl.close();
        rl = null;
    }

}