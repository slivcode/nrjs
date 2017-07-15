export namespace NSJS {
  export interface CommandItemObj {
    env?: Record<string, string | number>
    // respect multiline
    script?: string;
    // automatically remove \n
    cmd?: string;
  }

  export type CommandItem = string | CommandItemObj | Function;
  export type Command = CommandItem | CommandItem[];
  export type CommandSet = Command[];

  export type NRJSModule = Record<string, CommandSet>;
}