import * as dotenv from "dotenv";
dotenv.config();

export interface Headers {
    "User-Agent": string,
    "Authorization"?: string
}

export const headers: Headers  = {
    "User-Agent": process.env.USER_AGENT ?? "Encode42/Qobuzify (me@encode42.dev)"
};

export function injectToken(tokenType: string, token: string) {
    headers.Authorization = `${tokenType} ${token}`;
}
