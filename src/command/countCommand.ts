import type { Command } from "../type/command/Command";
import { getDownload } from "../util/getDownload";
import { filterDownloaded } from "../util/filterDownloaded";
import { chalk } from "zx";

export const countCommand: Command = {
    "name": "count",
    "description": "Count the number of tracks and artists downloaded.",
    "action": async () => {
        const artists = await getDownload("artist");
        const tracks = await getDownload("track");

        const downloadedArtists = filterDownloaded(artists, true);
        const downloadedTracks = filterDownloaded(tracks, true);

        printDownloaded("artists", Object.keys(downloadedArtists), Object.keys(artists));
        printDownloaded("tracks", Object.keys(downloadedTracks), Object.keys(tracks));
    }
};

export function printDownloaded(type: string, downloads: string[], originals: string[]) {
    console.log(`${chalk.bold(`${downloads.length}/${originals.length}`)} ${type} downloaded`);
}
