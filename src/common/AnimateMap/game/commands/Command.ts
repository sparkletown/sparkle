export default interface Command {
  execute(): Promise<Command>;
}
