import type { Command } from "~/type/command/Command";
import { createCommand, createOption, program } from "commander";
import { fetchCommand } from "~/command/fetchCommand";
import { downloadCommand } from "~/command/downloadCommand";

const commands: Command[] = [
    fetchCommand,
    downloadCommand
];

export function registerCommands() {
    for (const command of commands) {
        const theCommand = createCommand()
            .command(command.name)
            .action(command.action);

        if (command.description) {
            theCommand.description(command.description);
        }

        if (command.arguments) {
            theCommand.arguments(command.arguments);
        }

        if (command.options) {
            for (const option of command.options) {
                const theOption = createOption(`${option.name}${option.arguments ? ` ${option.arguments}` : undefined}`, option.description);

                theOption.default(option.default);
                theCommand.addOption(theOption);
            }
        }

        program.addCommand(theCommand);
    }

    program.parse();
}
