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

        const artists = await getDownload("artist");
        const tracks = await getDownload("track");

        const artistNames = Object.keys(artists).map(artist => artist.toUpperCase());
        const trackNames = Object.keys(tracks).map(track => track.toUpperCase());

        const matchedArtists = match(artistNames, downloadedArtists, options.threshold);
        const matchedTracks = match(trackNames, downloadedTracks, options.threshold);

        printMatched(matchedArtists.matches);
        printMatched(matchedTracks.matches);

        printNoMatched(matchedArtists.noMatches);
        printNoMatched(matchedTracks.noMatches);


        printNoMatched(filterNotDownloaded(artists), "☁");
        printNoMatched(filterNotDownloaded(tracks), "☁");
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

function filterNotDownloaded(map: Record<string, boolean>) {
    const notDownloaded: string[] = [];

    for (const [key, value] of Object.entries(map)) {
        if (value) {
            continue;
        }

        notDownloaded.push(key.toUpperCase());
    }

    return notDownloaded;
}

function printMatched(matches: Match[], point = "✔") {
    for (const match of matches) {
        console.log(`${point} ${chalk.green(match.original)}${match.original === match.downloaded ? "" : ` (as ${match.downloaded})`}`);
    }
}

function printNoMatched(matches: string[], point = "✖") {
    for (const match of matches) {
        console.log(`${point} ${chalk.red(match)}`);
    }
}
