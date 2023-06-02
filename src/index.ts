import { initPath } from "./util/path";
import { registerCommands } from "./command/registerCommands";

import { $ } from "zx";
$.verbose = false;

async function index() {
    await initPath();
    registerCommands();
}

index();
