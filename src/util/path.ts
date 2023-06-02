import { format, resolve } from "node:path";
import { access, mkdir } from "node:fs/promises";

export interface Directories {
    "build": string
}

export interface Files {
    "download": {
        "artists": string,
        "tracks": string
    }
}

export const directories: Directories = {
    "build": resolve("build")
};

export const files: Files = {
    "download": {
        "artists": "artists",
        "tracks": "tracks"
    }
};

export async function initPath() {
    await iterateDirectories(directories);

    // The default values define the names, while this loop fills in the full path
    for (const [key, value] of Object.entries(files.download)) {
        files.download[key as keyof typeof files.download] = format({
            "dir": directories.build,
            "name": value,
            "ext": "json"
        });
    }
}

async function iterateDirectories(children: Record<string, string> | Object) {
    for (const directory of Object.values(children)) {
        if (typeof directory !== "string") {
            await iterateDirectories(directory);
            continue;
        }

        try {
            await access(directory);
        } catch {
            await mkdir(directory);
        }
    }
}
