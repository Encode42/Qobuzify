import type { Command } from "../type/command/Command";
import { access, readdir } from "node:fs/promises";
import { basename, extname, sep } from "node:path";
import { chalk } from "zx";
import { closest, distance } from "fastest-levenshtein";
import { getDownload } from "../util/getDownload";

interface Match {
    "original": string,
    "downloaded": string
}

export const checkCommand: Command = {
    "name": "check",
    "description": "Check the existence of fetched Spotify tracks.",
    "arguments": "<qobuzDownloads>",
    "options": [{
        "name": "threshold",
        "description": "Similarity threshold required to count a track as downloaded. Integers closer to 0 are similar.",
        "arguments": "<threshold>",
        "default": "3"
    }],
    "action": async (qobuzDownloads, options) => {
        try {
            access(qobuzDownloads);
        } catch (error) {
            console.error(chalk.red("Cannot access Qobuz downloads folder!"));
            throw error;
        }

        const files = await readdir(qobuzDownloads, {
            "withFileTypes": true,
            "recursive": true
        });

        const downloadedArtists: string[] = [];
        const downloadedTracks: string[] = [];
        for (const file of files) {
            if (!file.isFile()) {
                continue;
            }

            const paths = file.path.split(sep);
            const artistName = paths.at(-2) ?? "unknown";
            const trackName = basename(file.name, extname(file.name)).replace(/\d* - /, "");

            downloadedArtists.push(artistName.toUpperCase());
            downloadedTracks.push(`${artistName} - ${trackName}`.toUpperCase());
        }

        const artists = Object.keys(await getDownload("artist")).map(artist => artist.toUpperCase());
        const tracks = Object.keys(await getDownload("track")).map(track => track.toUpperCase());

        const matchedArtists = match(artists, downloadedArtists, options.threshold);
        const matchedTracks = match(tracks, downloadedTracks, options.threshold);

        printMatched("artists", matchedArtists.matches);
        printMatched("tracks", matchedTracks.matches);

        printNoMatched("artists", matchedArtists.noMatches);
        printNoMatched("tracks", matchedTracks.noMatches);
    }
};

function match(originals: string[], downloads: string[], threshold: number) {
    const matches: Match[] = [];
    const noMatches: string[] = [];

    for (const download of downloads) {
        if (originals.includes(download)) {
            matches.push({
                "original": download,
                "downloaded": download
            });

            continue;
        }

        const isSimilar = closest(download, originals);
        const similarity = distance(download, isSimilar);

        if (similarity > threshold) {
            noMatches.push(download);

            continue;
        }

        matches.push({
            "original": isSimilar,
            "downloaded": download
        });
    }

    return {
        matches,
        noMatches
    };
}

function printMatched(type: string, matches: Match[]) {
    for (const match of matches) {
        console.log(`- ${chalk.green(match.original)}${match.original === match.downloaded ? "" : ` (as ${match.downloaded})`}`);
    }
}

function printNoMatched(type: string, matches: string[]) {
    for (const match of matches) {
        console.log(`- ${chalk.red(match)}`);
    }
}
