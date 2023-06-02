import { headers, injectToken } from "~/util/common/headers";
import { chalk, fetch } from "zx";

import * as dotenv from "dotenv";
dotenv.config();

let fetchedToken: string | undefined;

export async function getToken() {
    if (fetchedToken) {
        return fetchedToken;
    }

    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
        throw "Required environment variables SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET are undefined!";
    }

    const body = {
        "grant_type": "client_credentials",
        "client_id": process.env.SPOTIFY_CLIENT_ID,
        "client_secret": process.env.SPOTIFY_CLIENT_SECRET
    };

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
        searchParams.set(key, value);
    }

    const fetchToken = await fetch("https://accounts.spotify.com/api/token", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            ...headers
        },
        "body": searchParams.toString()
    });

    if (!fetchToken.ok) {
        console.error(chalk.red(`Fetching of token failed with status code ${fetchToken.status}!`));
        throw fetchToken.statusText;
    }

    const tokenData = await fetchToken.json();
    // todo: types
    fetchedToken = tokenData.access_token;

    injectToken(tokenData.token_type, fetchedToken);
    return fetchedToken;
}
