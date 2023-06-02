import type { Command } from "~/type/command/Command";
import { files } from "~/util/path";
import { $, chalk, retry, expBackoff } from "zx";
import { getDownload } from "~/util/getDownload";
import { writeFile } from "node:fs/promises";

const retries = 3;

export const downloadCommand: Command = {
    "name": "download",
    "description": "Download from Qobuz.",
    "arguments": "<type>",
    "action": async type => {
        if (!Object.keys(files.download).includes(type)) {
            console.error(chalk.red("Invalid type!"));
            throw `Type ${type} does not exist in ${Object.keys(files.download).join(", ")}.`;
        }

        const download = await getDownload(type);

        for (const key of Object.keys(download)) {
            console.log(chalk.bold(`Downloading ${key}...`));

            $.verbose = true;

            try {
                await retry(retries, expBackoff(), () => $`qobuz-dl lucky ${key} --type ${type} -q 27 --og-cover`);
            } catch (error) {
                console.warn(chalk.red(`Cannot download ${key} after ${retries} tries!`));
                console.warn(error);

                continue;
            } finally {
                $.verbose = false;
            }

            console.log(chalk.black.bgGreen("Done!"));
            download[key] = true;
        }

        await writeFile(files.download[type as keyof typeof files.download], JSON.stringify(download));
    }
};
