import { iterateNext } from "./iterateNext";

interface Artist {
    "label": string
}

export interface Track {
    "label": string,
    "artists": Artist[]
}

export interface Playlist {
    "label": string,
    "description": string,
    "tracks": Track[]
}

export async function getProfilePlaylists(id: string) {
    const playlists: Playlist[] = [];

    const playlistFragments = await iterateNext(new URL(`https://api.spotify.com/v1/users/${id}/playlists?limit=50`));
    for (const playlistFragment of playlistFragments) {
        for (const playlist of playlistFragment.items) {
            const tracks: Track[] = [];

            const trackHref = new URL(playlist.tracks.href);
            trackHref.searchParams.set("limit", "50");

            const trackFragments = await iterateNext(trackHref);
            for (const trackFragment of trackFragments) {
                for (const track of trackFragment.items) {
                    if (!track.track?.name || track.is_local) {
                        continue;
                    }

                    tracks.push({
                        "label": track.track.name,
                        // @ts-ignore
                        "artists": track.track.artists.map(artist => ({
                            "label": artist.name
                        }))
                    });
                }
            }

            playlists.push({
                "label": playlist.name,
                "description": playlist.description,
                tracks
            });
        }
    }

    return playlists;
}
