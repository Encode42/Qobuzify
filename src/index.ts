import { initPath } from "./util/path";
import { getToken } from "./util/getToken";
import { registerCommands } from "./command/registerCommands";

import { $ } from "zx";
$.verbose = false;

async function index() {
    await initPath();
    await getToken();

    registerCommands();
}

index();
