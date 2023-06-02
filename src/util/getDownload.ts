import { files } from "~/util/path";
import { readFile } from "node:fs/promises";

export async function getDownload(type: keyof typeof files.download) {
    const downloadFile = await readFile(files.download[type], {
        "encoding": "utf8"
    });

    return JSON.parse(downloadFile);
}
