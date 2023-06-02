import { initPath } from "~/util/path";
import { getToken } from "~/util/getToken";

import { $ } from "zx";
import { registerCommands } from "~/command/registerCommands";
$.verbose = false;

async function index() {
    await initPath();
    await getToken();

    registerCommands();
}

index();
