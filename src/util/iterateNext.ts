import { fetch } from "zx";
import { headers } from "~/util/common/headers";

export async function iterateNext(startingPoint: URL) {
    const responses: any[] = [];

    let next: URL | false = startingPoint;
    while (next) {
        const response = await fetch(next.toString(), {
            // todo: types
            headers
        });

        const responseData = await response.json();
        responses.push(responseData);

        // todo: types
        next = responseData.next ? new URL(responseData.next) : false;
    }

    return responses;
}
