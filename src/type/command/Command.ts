import type { Option } from "~/type/command/Option";

export interface Command {
    "name": string,
    "arguments"?: string,
    "description"?: string,
    "action": (...args: any[]) => void | Promise<void>,
    "options"?: Option[]
}
