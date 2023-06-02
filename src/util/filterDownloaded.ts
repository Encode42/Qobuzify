export function filterDownloaded(map: Record<string, boolean>, is: boolean) {
    const downloaded: string[] = [];

    for (const [key, value] of Object.entries(map)) {
        if (!value && is) {
            continue;
        }

        downloaded.push(key.toUpperCase());
    }

    return downloaded;
}
