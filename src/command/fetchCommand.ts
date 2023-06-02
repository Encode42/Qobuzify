import type { Command } from "~/type/command/Command";
import { writeFile } from "node:fs/promises";
import { getProfilePlaylists } from "~/util/getProfilePlaylists";
import { files } from "~/util/path";

interface DownloadedType {
    [key: string]: boolean
}

export const fetchCommand: Command = {
    "name": "fetch",
    "description": "Fetch the playlists and their tracks for the specified user(s).",
    "arguments": "<userIDs...>",
    "action": async userIDs => {
        const artists: DownloadedType = {};
        const tracks: DownloadedType = {};

        for (const userID of userIDs) {
            const playlists = await getProfilePlaylists(userID);

            for (const playlist of playlists) {
                for (const track of playlist.tracks) {
                    tracks[`${track.artists[0].label} - ${track.label}`] = false;

                    for (const artist of track.artists) {
                        artists[artist.label] = false;
                    }
                }
            }
        }

        await writeFile(files.download.artists, JSON.stringify(artists));
        await writeFile(files.download.tracks, JSON.stringify(tracks));
    }
};
