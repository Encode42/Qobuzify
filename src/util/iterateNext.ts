import { fetch } from "zx";
import { headers } from "./common/headers";

export async function iterateNext(startingPoint: URL) {
    const responses: any[] = [];

    let next: URL | false = startingPoint;
    while (next) {
        const response = await fetch(next.toString(), {
            // @ts-ignore
            headers
        });

        const responseData = await response.json();
        responses.push(responseData);

        // @ts-ignore
        next = responseData.next ? new URL(responseData.next) : false;
    }

    return responses;
}
