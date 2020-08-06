export class InvalidVenueName extends Error {
  constructor() {
    super("This venue name is already taken");
  }
}
