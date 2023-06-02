import type { Option } from "./Option";

export interface Command {
    "name": string,
    "arguments"?: string,
    "description"?: string,
    "action": (...args: any[]) => void | Promise<void>,
    "options"?: Option[]
}
